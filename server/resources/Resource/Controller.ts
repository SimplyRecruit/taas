import Resource from 'models/Resource'
import UserRole from 'models/User/UserRole'
import {
  Authorized,
  CurrentUser,
  Delete,
  ForbiddenError,
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
  Patch,
  Post,
} from 'routing-controllers'
import { EntityNotFoundError } from 'typeorm'
import { Body } from '~/decorators/CustomRequestParams'
import { AlreadyExistsError } from '~/errors/AlreadyExistsError'
import { dataSource } from '~/main'
import CustomerEntity from '~/resources/Customer/Entity'
import CustomerResourceEntity from '~/resources/relations/CustomerResource'
import ResourceEntity from '~/resources/Resource/Entity'
import UserEntity from '~/resources/User/Entity'

@JsonController('/resource')
export default class ResourceController {
  @Get()
  @Authorized(UserRole.ADMIN)
  async getAll(@CurrentUser() currentUser: UserEntity) {
    return await ResourceEntity.findBy({
      user: { organization: { id: currentUser.organization.id } },
    })
  }

  @Patch('/:id')
  @Authorized(UserRole.ADMIN)
  async update(
    @CurrentUser() currentUser: UserEntity,
    @Param('id') resourceId: string,
    @Body({ validate: { skipMissingProperties: true } }) body: Resource
  ) {
    await dataSource.transaction(async em => {
      try {
        const resource = await em.findOneOrFail(ResourceEntity, {
          where: { id: resourceId },
          relations: { user: true },
        })
        if (resource.user.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        await em.update(ResourceEntity, resourceId, body)
      } catch (error) {
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Resource Update Successful'
  }

  // @Post()
  // @Authorized(UserRole.ADMIN)
  // async create(@BodyParam("user") { email, password, name }: RegisterReqBody, @BodyParam("resource") resource: Resource, @CurrentUser() currentUser: UserEntity) {
  //     const passwordHash = Bcrypt.hashSync(password, 8)
  //     await dataSource.transaction(async (em) => {
  //         try {
  //             if (await em.findOneBy(ResourceEntity, { id: resource.id }) != null) throw new AlreadyExistsError("Resource already exists")
  //             const newUser = await em.save(UserEntity.create({ email, passwordHash, name, organization: currentUser.organization }))
  //             const newResource = await em.save(ResourceEntity.create({ ...resource, organization: currentUser.organization, user: newUser }))
  //         } catch (error) {
  //             if (error instanceof AlreadyExistsError) throw new AlreadyExistsError("Resource already exists")
  //             else throw new InternalServerError("Internal Server Error")
  //         }
  //     })
  //     return "Resource Creation Successful"
  // }

  @Delete('/:id')
  @Authorized(UserRole.ADMIN)
  async delete(
    @Param('id') resourceId: string,
    @CurrentUser() currentUser: UserEntity
  ) {
    await dataSource.transaction(async em => {
      try {
        const resource = await em.findOneOrFail(ResourceEntity, {
          where: { id: resourceId },
          relations: { user: true },
        })
        if (resource.user.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        await em.remove(resource.user)
        await em.remove(resource)
      } catch (error) {
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Resource Deletion Successful'
  }

  @Get('/customers')
  async getCustomers(@CurrentUser() currentUser: UserEntity) {
    try {
      const currentResource = await ResourceEntity.findOneByOrFail({
        user: { id: currentUser.id },
      })
      const [customers, count] = await CustomerResourceEntity.findAndCount({
        relations: { customer: true },
        where: { resource: { id: currentResource.id } },
      })
      return { customers, count }
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError)
        throw new ForbiddenError('You are not a resource')
      else throw new InternalServerError('Internal Server Error')
    }
  }

  @Get('/:id/customers')
  @Authorized(UserRole.ADMIN)
  async getCustomersOf(@Param('id') resourceUserId: string) {
    try {
      const resource = await ResourceEntity.findOneByOrFail({
        id: resourceUserId,
      })
      const customers = await CustomerResourceEntity.find({
        relations: { customer: true },
        where: { resource: { id: resource.id } },
      })
      return customers
    } catch (error) {
      if (error instanceof EntityNotFoundError)
        throw new ForbiddenError('You are not a resource')
      else throw new InternalServerError('Internal Server Error')
    }
  }

  @Post('/:resourceId/customers/:customerId')
  @Authorized(UserRole.ADMIN)
  async assignCustomerToResource(
    @CurrentUser() currentUser: UserEntity,
    @Param('resourceId') resourceId: string,
    @Param('customerId') customerId: string
  ) {
    await dataSource.transaction(async em => {
      try {
        const existing = await em.findOne(CustomerResourceEntity, {
          where: { resource: { id: resourceId }, customer: { id: customerId } },
        })
        if (existing != null) throw new AlreadyExistsError()
        const resource = await em.findOneOrFail(ResourceEntity, {
          where: { id: resourceId },
          relations: { user: true },
        })
        if (resource.user.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        const customer = await em.findOneOrFail(CustomerEntity, {
          where: { id: customerId },
          relations: { organization: true },
        })
        if (customer.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        await em.save(CustomerResourceEntity, { customer, resource })
      } catch (error) {
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else if (error instanceof AlreadyExistsError)
          throw new AlreadyExistsError(
            'Customer is already assigned to resource'
          )
        else throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Assigned Customer to Resource'
  }
}
