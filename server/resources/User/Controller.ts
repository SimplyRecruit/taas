import Bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import type { Request } from 'express'
import Jwt from 'jsonwebtoken'
import {
  ResourceCreateBody,
  type Language,
  LoginReqBody,
  RegisterOrganizationReqBody,
  User,
  UserRole,
  UserStatus,
  ResetPasswordReqBody,
} from 'models'
import {
  Authorized,
  CurrentUser,
  HeaderParam,
  InternalServerError,
  JsonController,
  NotFoundError,
  QueryParam,
  Req,
  UnauthorizedError,
} from 'routing-controllers'
import { EntityNotFoundError } from 'typeorm'
import { EmailTemplate } from '~/common/DataClasses'
import { sendEmail } from '~/common/Util'
import { Get, Post } from '~/decorators/CustomApiMethods'
import { Body } from '~/decorators/CustomRequestParams'
import { AlreadyExistsError } from '~/errors/AlreadyExistsError'
import { dataSource } from '~/main'
import OrganizationEntity from '~/resources/Organization/Entity'
import SessionTokenEntity from '~/resources/SessionToken/Entity'
import {
  createResetPasswordLink,
  createSessionToken,
} from '~/resources/User/AuthService'
import UserEntity from '~/resources/User/Entity'

@JsonController('/user')
export default class UserController {
  @Post(String, '/login')
  async login(@Body() { email, password }: LoginReqBody) {
    const user = await UserEntity.findOne({
      where: { email },
      select: {
        id: true,
        role: true,
        status: true,
        isEnabled: true,
        passwordHash: true,
      },
    })
    if (user == null) throw new UnauthorizedError()
    if (user.status == UserStatus.PENDING) throw new UnauthorizedError()
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

  @Post(undefined, '/register-organization')
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
          hourlyRate: 0,
          startDate: new Date(),
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
        if (error.code == 23505)
          throw new AlreadyExistsError('User already exists')
        throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Registration Succesful'
  }

  @Post(String, '/invite-member')
  @Authorized(UserRole.ADMIN)
  async inviteMember(
    @Body()
    { email, name, ...rest }: ResourceCreateBody,
    @CurrentUser() currentUser: UserEntity,
    @Req() req: Request,
    @HeaderParam('Accept-Language') language: Language
  ) {
    let id
    await dataSource.transaction(async em => {
      try {
        const user = await em.save(UserEntity, {
          email,
          name,
          organization: currentUser.organization,
          ...rest,
        })
        id = user.id
        const token = await createSessionToken(user, em)
        const link = createResetPasswordLink(req, token, email)
        const emailTemplate = new EmailTemplate.ResetPassword(language, {
          name,
          link,
        })
        await sendEmail(email, emailTemplate)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.code == 23505)
          throw new AlreadyExistsError('User already exists')
        throw new InternalServerError('Internal Server Error')
      }
    })
    return id
  }

  @Post(undefined, '/reset-password')
  async resetPassword(
    @Body()
    { token, email, password }: ResetPasswordReqBody
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
        user.passwordHash = Bcrypt.hashSync(password, 8)
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

  @Post(undefined, '/forgot-password')
  async forgotPassword(
    @QueryParam('email') email: string,
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

  @Get(User, '/me')
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
