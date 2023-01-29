import Customer from "models/Customer"
import UserRole from "models/User/UserRole"
import { AlreadyExistsError } from "server/errors/AlreadyExistsError"
import { Authorized, Body, CurrentUser, Delete, ForbiddenError, Get, InternalServerError, JsonController, NotFoundError, Param, Patch, Post } from "routing-controllers"
import { EntityNotFoundError } from "typeorm"
import { dataSource } from "~/main"
import { CustomerEntity } from "~/resources/Customer/Entity"
import { UserEntity } from "~/resources/User/Entity"
import { CustomerResourceEntity } from "~/resources/relations/CustomerResource"


@JsonController("/customer")
@Authorized(UserRole.ADMIN)
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

    @Get('/:id/resources')
    async getResourcesOf(@CurrentUser() currentUser: UserEntity, @Param("id") customerId: string) {
        try {
            const customer = await CustomerEntity.findOneOrFail({ where: { id: customerId }, relations: { organization: true } })
            if (customer.organization.id !== currentUser.organization.id) throw new ForbiddenError()
            const [resources, count] = await CustomerResourceEntity.findAndCount({ relations: { resource: true }, where: { customer: { id: customer.id } } })
            return { resources, count }
        } catch (error) {
            console.log(error);
            if (error instanceof EntityNotFoundError) throw new NotFoundError()
            else if (error instanceof ForbiddenError) throw new ForbiddenError()
            else throw new InternalServerError("Internal Server Error")
        }
    }
}