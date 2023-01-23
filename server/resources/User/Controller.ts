import { Body, Get, Post, JsonController, CurrentUser, UnauthorizedError, HttpError, InternalServerError, BodyParam, Req } from 'routing-controllers';
import Bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import LoginReqBody from '@/models/LoginReqBody';
import { UserEntity } from '@/server/resources/User/Entity';
import RegisterReqBody from '@/models/RegisterReqBody';
import UserRole from '@/models/UserRole';
import User from '@/models/User';
import crypto from "crypto"
import { AlreadyExistsError } from '@/server/errors/AlreadyExistsError';
import { SessionTokenEntity } from '@/server/resources/SessionToken/Entity';
import { createResetPasswordLink, sendResetPasswordEmail } from '@/server/resources/User/AuthService';
import type { Request } from 'express';

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

    @Post('/register')
    async register(@Body() { email, password, name }: RegisterReqBody) {
        const passwordHash = Bcrypt.hashSync(password, 8)
        try {
            await UserEntity.create({ email, passwordHash, name, role: UserRole.ADMIN }).save()
        } catch (error: any) {
            if (error.code == 23505) throw new AlreadyExistsError("User already exists")
            else throw new InternalServerError("Internal Server Error")
        }
        return "Registration Succesful"
    }

    @Post('/reset-password')
    async resetPassword(@Body() { email, password, name }: RegisterReqBody) {

        // tokenı kontrol et
        // şifreyi değiştirs
        const passwordHash = Bcrypt.hashSync(password, 8)
        try {
            await UserEntity.create({ email, passwordHash, name, role: UserRole.ADMIN }).save()
        } catch (error: any) {
            if (error.code == 23505) throw new AlreadyExistsError("User already exists")
            else throw new InternalServerError("Internal Server Error")
        }
        return "Registration Succesful"
    }


    @Post('/forgot-password')
    async forgotPassword(@BodyParam("email") email: string, @Req() req: Request) {
        let token = crypto.randomBytes(128).toString('hex');
        const tokenHash = Bcrypt.hashSync(token, 8)
        try {
            var user = await UserEntity.findOneByOrFail({ email })
            const expiration = new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours
            await SessionTokenEntity.save({ tokenHash, user, expiration })
            const link = createResetPasswordLink(req, token)
            await sendResetPasswordEmail(user, link)
        } catch (error: any) {
            console.log(error)
            if (error.code == 23505) throw new AlreadyExistsError("User already exists")
            else throw new InternalServerError("Internal Server Error")
        }
        return "Password reset email successfully sent"
    }

    @Get('/me')
    async me(@CurrentUser() user: User) {
        return user
    }
}