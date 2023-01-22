import LoginReqBody from '../../../models/LoginReqBody';
import { Body, Get, Post, JsonController, Authorized, CurrentUser, BadRequestError, UnauthorizedError, HttpError, InternalServerError, BodyParam, Put, Param, Patch, NotFoundError, ForbiddenError, Delete } from 'routing-controllers';
import { UserEntity } from '../User/Entity';
import Bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import RegisterReqBody from '../../../models/RegisterReqBody';
import User from '../../../models/User';
import UserRole from '../../../models/UserRole';
import { ResourceEntity } from './Entity';
import Resource from '../../../models/Resource';
import { dataSource } from '../../main';
import { isUUID, IsUUID } from 'class-validator';
import { EntityNotFoundError } from 'typeorm';
import { CustomerEntity } from '../Customer/Entity';
import { CustomerResourceEntity } from '../relations/CustomerResource';

@JsonController("/resource")
export default class {

    @Get()
    async getAll(@CurrentUser() currentUser: UserEntity) {
        return await ResourceEntity.findBy({ organization: { id: currentUser.organization.id } })
    }

    @Patch('/:id')
    async update(@CurrentUser() currentUser: UserEntity, @Param("id") resourceId: string, @Body({ validate: { skipMissingProperties: true } }) body: Resource) {
        await dataSource.transaction(async em => {
            try {
                const resource = await em.findOneOrFail(ResourceEntity, { where: { id: resourceId }, relations: { organization: true } })
                if (resource.organization.id !== currentUser.organization.id) throw new ForbiddenError()
                await em.update(ResourceEntity, resourceId, body)
            } catch (error: any) {
                if (error instanceof EntityNotFoundError) throw new NotFoundError()
                else if (error instanceof ForbiddenError) throw new ForbiddenError()
                else if (error.code == 23505) throw new HttpError(409, "Resource already exists")
                else throw new InternalServerError("Internal Server Error")
            }
        })
        return "Resource Update Successful"
    }

    @Post()
    async create(@BodyParam("user") { email, password, name }: RegisterReqBody, @BodyParam("resource") resource: Resource, @CurrentUser() currentUser: UserEntity) {
        const passwordHash = Bcrypt.hashSync(password, 8)
        await dataSource.transaction(async (em) => {
            try {
                const newUser = await em.save(UserEntity.create({ email, passwordHash, name, organization: currentUser.organization }))
                const newResource = await em.save(ResourceEntity.create({ ...resource, organization: currentUser.organization, user: newUser }))
            } catch (error: any) {
                if (error.code == 23505) throw new HttpError(409, "Resource already exists")
                else throw new InternalServerError("Internal Server Error")
            }
        })
        return "Resource Creation Successful"
    }

    @Delete('/:id')
    async delete(@Param("id") resourceId: string, @CurrentUser() currentUser: UserEntity) {
        await dataSource.transaction(async em => {
            try {
                const resource = await em.findOneOrFail(ResourceEntity, { where: { id: resourceId }, relations: { organization: true, user: true } })
                if (resource.organization.id !== currentUser.organization.id) throw new ForbiddenError()
                await em.remove(resource.user)
                await em.remove(resource)
            } catch (error) {
                if (error instanceof EntityNotFoundError) throw new NotFoundError()
                else if (error instanceof ForbiddenError) throw new ForbiddenError()
                else throw new InternalServerError("Internal Server Error")
            }
        })
        return "Resource Deletion Successful"
    }

    @Get('/customers')
    async getCustomers(@CurrentUser() currentUser: UserEntity) {
        try {
            const currentResource = await ResourceEntity.findOneByOrFail({ user: { id: currentUser.id } })
            const [customers, count] = await CustomerResourceEntity.findAndCount({ relations: { customer: true }, where: { resource: { id: currentResource.id } } })
            return { customers, count }
        } catch (error: any) {
            if (error instanceof EntityNotFoundError) throw new ForbiddenError("You are not a resource")
            else throw new InternalServerError("Internal Server Error")
        }
    }

    @Get('/:id/customers')
    @Authorized(UserRole.ADMIN)
    async getCustomersOf(@Param("id") resourceUserId: string) {
        try {
            const resource = await ResourceEntity.findOneByOrFail({ id: resourceUserId })
            const customers = await CustomerResourceEntity.find({ relations: { customer: true }, where: { resource: { id: resource.id } } })
            return customers
        } catch (error) {
            console.log(error);
            if (error instanceof EntityNotFoundError) throw new ForbiddenError("You are not a resource")
            else throw new InternalServerError("Internal Server Error")
        }
    }
}