import Bcrypt from 'bcrypt'
import type { Request } from 'express'
import Jwt from 'jsonwebtoken'
import { InviteMemberReqBody, User } from 'models'
import type Language from 'models/Language'
import LoginReqBody from 'models/User/LoginReqBody'
import RegisterOrganizationReqBody from 'models/User/RegisterOrganizationReqBody'
import UserRole from 'models/User/UserRole'
import UserStatus from 'models/User/UserStatus'
import {
  Authorized,
  BodyParam,
  CurrentUser,
  Get,
  HeaderParam,
  InternalServerError,
  JsonController,
  NotFoundError,
  Post,
  Req,
  UnauthorizedError,
} from 'routing-controllers'
import { EntityNotFoundError } from 'typeorm'
import { EmailTemplate } from '~/common/DataClasses'
import { sendEmail } from '~/common/Util'
import { Body } from '~/decorators/CustomRequestParams'
import { AlreadyExistsError } from '~/errors/AlreadyExistsError'
import { dataSource } from '~/main'
import OrganizationEntity from '~/resources/Organization/Entity'
import ResourceEntity from '~/resources/Resource/Entity'
import SessionTokenEntity from '~/resources/SessionToken/Entity'
import {
  createResetPasswordLink,
  createSessionToken,
} from '~/resources/User/AuthService'
import UserEntity from '~/resources/User/Entity'

@JsonController('/user')
export default class UserController {
  @Post('/login')
  async login(@Body() { email, password }: LoginReqBody) {
    const user = await UserEntity.findOneBy({ email })
    if (user == null) throw new UnauthorizedError()
    const isPasswordCorrect = Bcrypt.compareSync(password, user.passwordHash)
    if (!isPasswordCorrect) throw new UnauthorizedError()
    const token = Jwt.sign(
      {
        id: user.id,
        role: user.role,
        status: user.status,
        active: user.isEnabled,
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env['JWT_SECRET']!,
      {
        expiresIn: 86400, // 24 hours
      }
    )
    return token
  }

  @Post('/register-organization')
  @Authorized(UserRole.SU)
  async registerOrganization(
    @Body() { email, organizationName, name }: RegisterOrganizationReqBody,
    @Req() req: Request,
    @HeaderParam('Accept-Language') language: Language
  ) {
    await dataSource.transaction(async em => {
      try {
        const organization = await em.save(OrganizationEntity, {
          name: organizationName,
        })
        const user = await em.save(UserEntity, {
          email,
          name,
          role: UserRole.ADMIN,
          organization,
        })
        const token = await createSessionToken(user, em)
        const link = createResetPasswordLink(req, token, email)
        const emailTemplate = new EmailTemplate.ResetPassword(language, {
          name,
          link,
        })
        await sendEmail(email, emailTemplate)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error)
        if (error.code == 23505)
          throw new AlreadyExistsError('User already exists')
        throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Registration Succesful'
  }

  @Post('/invite-member')
  @Authorized(UserRole.ADMIN)
  async inviteMember(
    @Body() { email, hourlyRate, name, role }: InviteMemberReqBody,
    @CurrentUser() currentUser: UserEntity,
    @Req() req: Request,
    @HeaderParam('Accept-Language') language: Language
  ) {
    await dataSource.transaction(async em => {
      try {
        const user = await em.save(UserEntity, {
          email,
          name,
          role,
          organization: currentUser.organization,
        })
        await em.save(ResourceEntity, {
          id: '123',
          hourlyRate,
          user,
          startDate: new Date(),
        })
        const token = await createSessionToken(user, em)
        const link = createResetPasswordLink(req, token, email)
        const emailTemplate = new EmailTemplate.ResetPassword(language, {
          name,
          link,
        })
        await sendEmail(email, emailTemplate)
        return 'Invitation Sent'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error)
        if (error.code == 23505)
          throw new AlreadyExistsError('User already exists')
        throw new InternalServerError('Internal Server Error')
      }
    })
  }

  @Post('/reset-password')
  async resetPassword(
    @BodyParam('token') token: string,
    @BodyParam('email') email: string,
    @BodyParam('newPassword') newPassword: string
  ) {
    await dataSource.transaction(async em => {
      try {
        const sessionToken = await em.findOneOrFail(SessionTokenEntity, {
          where: { user: { email } },
          relations: { user: true },
        })
        const { user, expiration, tokenHash } = sessionToken
        if (
          Date.now() > expiration.getTime() ||
          !Bcrypt.compareSync(token, tokenHash)
        )
          throw new UnauthorizedError()
        user.passwordHash = Bcrypt.hashSync(newPassword, 8)
        user.status = UserStatus.CONFIRMED
        await em.save(user)
        await em.remove(sessionToken)
      } catch (error) {
        if (
          error instanceof UnauthorizedError ||
          error instanceof EntityNotFoundError
        ) {
          throw new UnauthorizedError()
        }
        throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Reset password successfully'
  }

  @Post('/forgot-password')
  async forgotPassword(
    @BodyParam('email') email: string,
    @Req() req: Request,
    @HeaderParam('Accept-Language') language: Language
  ) {
    try {
      const user = await UserEntity.findOneByOrFail({ email })
      if (user.status != UserStatus.CONFIRMED) throw new UnauthorizedError()
      const token = await createSessionToken(user)
      const link = createResetPasswordLink(req, token, email)
      const emailTemplate = new EmailTemplate.ResetPassword(language, {
        name: user.name,
        link,
      })
      await sendEmail(email, emailTemplate)
    } catch (error: unknown) {
      if (error instanceof UnauthorizedError) throw error
      if (error instanceof EntityNotFoundError)
        throw new NotFoundError('No user with given email')
      throw new InternalServerError('Internal Server Error')
    }
    return 'Password reset email successfully sent'
  }

  @Get('/me')
  async me(@CurrentUser() user: UserEntity) {
    return User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: { id: user.organization.id, name: user.organization.name },
    })
  }
}
