import LoginReqBody from '../../../models/LoginReqBody';
import { Body, Get, Post, JsonController, Authorized, CurrentUser, BadRequestError, UnauthorizedError, HttpError, InternalServerError, BodyParam, Put, Param, Patch, NotFoundError, ForbiddenError, Delete } from 'routing-controllers';
import { UserEntity } from '../User/Entity';
import Bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import RegisterReqBody from '../../../models/RegisterReqBody';
import User from '../../../models/User';
import UserRole from '../../../models/UserRole';
import { ResourceEntity } from '../Resource/Entity';
import Resource from '../../../models/Resource';
import { dataSource } from '../../main';
import { isUUID, IsUUID } from 'class-validator';
import { EntityNotFoundError } from 'typeorm';
import { CustomerEntity } from '../Customer/Entity';
import { CustomerResourceEntity } from '../relations/CustomerResource';
import Customer from '../../../models/Customer';
import { AlreadyExistsError } from '../../errors/AlreadyExistsError';

@JsonController("/customer")
export default class {

    @Get()
    async getAll(@CurrentUser() currentUser: UserEntity) {
        return await CustomerEntity.findBy({ organization: { id: currentUser.organization.id } })
    }

    @Patch('/:id')
    async update(@CurrentUser() currentUser: UserEntity, @Param("id") customerId: string, @Body({ validate: { skipMissingProperties: true } }) body: Customer) {
        await dataSource.transaction(async em => {
            try {
                const customer = await em.findOneOrFail(CustomerEntity, { where: { id: customerId }, relations: { organization: true } })
                if (customer.organization.id !== currentUser.organization.id) throw new ForbiddenError()
                await em.update(CustomerEntity, customerId, body)
            } catch (error: any) {
                if (error instanceof EntityNotFoundError) throw new NotFoundError()
                else if (error instanceof ForbiddenError) throw new ForbiddenError()
                else throw new InternalServerError("Internal Server Error")
            }
        })
        return "Customer Update Successful"
    }

    @Post()
    async create(@CurrentUser() currentUser: UserEntity, @Body() customer: Customer) {
        await dataSource.transaction(async (em) => {
            try {
                if (await em.findOneBy(CustomerEntity, { id: customer.id }) != null) throw new AlreadyExistsError("Resource already exists")
                await em.save(CustomerEntity.create({ organization: currentUser.organization, ...customer }))
            } catch (error) {
                if (error instanceof AlreadyExistsError) throw new AlreadyExistsError("Customer already exists")
                else throw new InternalServerError("Internal Server Error")
            }
        })
        return "Customer Creation Successful"
    }

    @Delete('/:id')
    async delete(@Param("id") customerId: string, @CurrentUser() currentUser: UserEntity) {
        await dataSource.transaction(async em => {
            try {
                const customer = await em.findOneOrFail(CustomerEntity, { where: { id: customerId }, relations: { organization: true } })
                if (customer.organization.id !== currentUser.organization.id) throw new ForbiddenError()
                await em.remove(customer)
            } catch (error) {
                if (error instanceof EntityNotFoundError) throw new NotFoundError()
                else if (error instanceof ForbiddenError) throw new ForbiddenError()
                else throw new InternalServerError("Internal Server Error")
            }
        })
        return "Customer Deletion Successful"
    }

    @Get('/resources')
    async getResources(@CurrentUser() currentUser: UserEntity) {
        // try {
        //     const currentResource = await ResourceEntity.findOneByOrFail({ user: { id: currentUser.id } })
        //     const [customers, count] = await CustomerResourceEntity.findAndCount({ relations: { customer: true }, where: { resource: { id: currentResource.id } } })
        //     return { customers, count }
        // } catch (error: any) {
        //     if (error instanceof EntityNotFoundError) throw new ForbiddenError("You are not a resource")
        //     else throw new InternalServerError("Internal Server Error")
        // }
    }
}