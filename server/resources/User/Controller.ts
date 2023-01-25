import { Body, Get, Post, JsonController, CurrentUser, UnauthorizedError, HttpError, InternalServerError, BodyParam, Req, ForbiddenError, Authorized } from 'routing-controllers';
import Bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import LoginReqBody from '@/models/User/LoginReqBody';
import { UserEntity } from '@/server/resources/User/Entity';
import RegisterOrganizationReqBody from '@/models/User/RegisterOrganizationReqBody';
import UserRole from '@/models/User/UserRole';
import User from '@/models/User/User';
import { AlreadyExistsError } from '@/server/errors/AlreadyExistsError';
import { SessionTokenEntity } from '@/server/resources/SessionToken/Entity';
import { createResetPasswordLink, createSessionToken } from '@/server/resources/User/AuthService';
import type { Request } from 'express';
import { dataSource } from '@/server/main';
import UserStatus from '@/models/User/UserStatus';
import { OrganizationEntity } from '@/server/resources/Organization/Entity';
import { sendEmail } from '@/server/common/Util';
import { ResetPasswordEmailTemplate } from '@/server/common/DataClasses';

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
    async registerOrganization(@Body() { email, organizationName, name }: RegisterOrganizationReqBody) {
        await dataSource.transaction(async em => {
            try {
                const organization = await em.create(OrganizationEntity, { name: organizationName }).save()
                await em.create(UserEntity, { email, name, role: UserRole.ADMIN, organization, status: UserStatus.CONFIRMED }).save()
            } catch (error: any) {
                if (error.code == 23505) throw new AlreadyExistsError("User already exists")
                else throw new InternalServerError("Internal Server Error")
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
                else throw new InternalServerError("Internal Server Error")
            }
        })
        return "Reset password successfully"
    }

    @Post('/forgot-password')
    async forgotPassword(@BodyParam("email") email: string, @Req() req: Request) {

        try {
            var user = await UserEntity.findOneByOrFail({ email })
            const token = await createSessionToken(user)
            const link = createResetPasswordLink(req, token, email)
            const emailTemplate = new ResetPasswordEmailTemplate({ name: user.name, link })
            await sendEmail(user.email, "EN", emailTemplate)
        } catch (error: any) {
            if (error.code == 23505) throw new AlreadyExistsError("User already exists")
            else if (error instanceof UnauthorizedError) throw error
            else throw new InternalServerError("Internal Server Error")
        }
        return "Password reset email successfully sent"
    }

    @Get('/me')
    async me(@CurrentUser() user: User) {
        return user
    }
}