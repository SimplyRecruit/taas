import { Body, Get, Post, JsonController, CurrentUser, UnauthorizedError, HttpError, InternalServerError, BodyParam, Req, ForbiddenError, Authorized, NotFoundError, HeaderParam } from 'routing-controllers';
import Bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import LoginReqBody from 'models/User/LoginReqBody';
import { UserEntity } from '~/resources/User/Entity';
import RegisterOrganizationReqBody from 'models/User/RegisterOrganizationReqBody';
import UserRole from 'models/User/UserRole';
import User from 'models/User/User';
import { AlreadyExistsError } from '~/errors/AlreadyExistsError';
import { SessionTokenEntity } from '~/resources/SessionToken/Entity';
import { createResetPasswordLink, createSessionToken } from '~/resources/User/AuthService';
import type { Request } from 'express';
import { dataSource } from '~/main';
import UserStatus from 'models/User/UserStatus';
import { OrganizationEntity } from '~/resources/Organization/Entity';
import { sendEmail } from '~/common/Util';
import { EntityNotFoundError } from 'typeorm';
import type Language from 'models/Language';
import { EmailTemplate } from '~/common/DataClasses';

@JsonController("/user")
export default class {

    @Post('/login')
    async login(@Body() { email, password }: LoginReqBody) {
        const user = await UserEntity.findOneBy({ email })
        if (user == null) throw new UnauthorizedError()
        const isPasswordCorrect = Bcrypt.compareSync(password, user.passwordHash)
        if (!isPasswordCorrect) throw new UnauthorizedError()
        const token = Jwt.sign(
            { id: user.id, role: user.role },
            process.env['JWT_SECRET']!,
            {
                expiresIn: 86400 // 24 hours
            }
        )
        return token
    }

    @Post('/register-organization')
    @Authorized(UserRole.SU)
    async registerOrganization(@Body() { email, organizationName, name }: RegisterOrganizationReqBody, @Req() req: Request, @HeaderParam("Accept-Language") language: Language) {
        await dataSource.transaction(async em => {
            try {
                const organization = await em.save(OrganizationEntity, { name: organizationName })
                const user = await em.save(UserEntity, { email, name, role: UserRole.ADMIN, organization })
                const token = await createSessionToken(user, true, em)
                const link = createResetPasswordLink(req, token, email)
                const emailTemplate = new EmailTemplate.ResetPassword(language, { name, link })
                await sendEmail(email, emailTemplate)
            } catch (error: any) {
                console.log(error)
                if (error.code == 23505) throw new AlreadyExistsError("User already exists")
                if (error instanceof UnauthorizedError) throw error
                if (error instanceof EntityNotFoundError) throw new NotFoundError("No user with given email")
                throw new InternalServerError("Internal Server Error")
            }

        })
        return "Registration Succesful"
    }

    @Post('/reset-password')
    async resetPassword(@BodyParam("token") token: string, @BodyParam("email") email: string, @BodyParam("newPassword") newPassword: string) {
        await dataSource.transaction(async em => {
            try {
                const sessionToken = await em.findOneOrFail(SessionTokenEntity, { where: { user: { email } }, relations: { user: true } })
                const { user, expiration, tokenHash } = sessionToken
                if (Date.now() > expiration.getTime() || !Bcrypt.compareSync(token, tokenHash))
                    throw new UnauthorizedError()
                user.passwordHash = Bcrypt.hashSync(newPassword, 8)
                user.status = UserStatus.CONFIRMED
                await em.save(user)
                await em.remove(sessionToken)
            } catch (error) {
                if (error instanceof UnauthorizedError) throw error
                throw new InternalServerError("Internal Server Error")
            }
        })
        return "Reset password successfully"
    }

    @Post('/forgot-password')
    async forgotPassword(@BodyParam("email") email: string, @Req() req: Request, @HeaderParam("Accept-Language") language: Language) {
        try {
            const user = await UserEntity.findOneByOrFail({ email })
            const token = await createSessionToken(user, false)
            const link = createResetPasswordLink(req, token, email)
            const emailTemplate = new EmailTemplate.ResetPassword(language, { name: user.name, link })
            await sendEmail(email, emailTemplate)
        } catch (error: any) {
            if (error instanceof UnauthorizedError) throw error
            if (error instanceof EntityNotFoundError) throw new NotFoundError("No user with given email")
            throw new InternalServerError("Internal Server Error")
        }
        return "Password reset email successfully sent"
    }

    @Get('/me')
    async me(@CurrentUser() user: User) {
        return user
    }
}