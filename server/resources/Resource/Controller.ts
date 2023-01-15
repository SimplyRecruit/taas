import LoginReqBody from '../../../models/LoginReqBody';
import { Body, Get, Post, JsonController, Authorized, CurrentUser, BadRequestError, UnauthorizedError, HttpError, InternalServerError, BodyParam } from 'routing-controllers';
import { UserEntity } from '../User/Entity';
import Bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import RegisterReqBody from '../../../models/RegisterReqBody';
import User from '../../../models/User';
import UserRole from '../../../models/UserRole';
import { ResourceEntity } from './Entity';
import Resource from '../../../models/Resource';
import { dataSource } from '../../main';

@JsonController("/resource")
export default class {

    @Post()
    async create(@BodyParam("user") { email, password, name }: RegisterReqBody, @BodyParam("resource") resource: Resource, @CurrentUser() currentUser: UserEntity) {
        const passwordHash = Bcrypt.hashSync(password, 8)
        await dataSource.transaction(async (em) => {
            try {
                const newUser = await em.save(UserEntity.create({ email, passwordHash, name, organization: currentUser.organization }))
                const newResource = await em.save(ResourceEntity.create({ ...resource, organization: currentUser.organization, user: newUser }))
            } catch (error: any) {
                if (error.code == 23505) throw new HttpError(409, "User already exists")
                else throw new InternalServerError("Internal Server Error")
            }
        })
        return "Resource Creation Succesful"
    }
}