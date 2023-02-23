import { Resource, UserRole } from 'models'
import moment from 'dayjs'
import ResourceUpdateBody from 'models/Resource/req-bodies/ResourceUpdateBody'
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
import ClientEntity from '~/resources/Client/Entity'
import ClientResourceEntity from '~/resources/relations/ClientResource'
import ResourceEntity from '~/resources/Resource/Entity'
import UserEntity from '~/resources/User/Entity'
import { mergeDeep } from '~/common/Util'

@JsonController('/resource')
export default class ResourceController {
  @Get()
  @Authorized(UserRole.ADMIN)
  async getAll(@CurrentUser() currentUser: UserEntity) {
    const entityObjects = await ResourceEntity.find({
      where: { user: { organization: { id: currentUser.organization.id } } },
      relations: { user: true },
    })
    return entityObjects.map(({ id, user, active, startDate, hourlyRate }) =>
      Resource.create({
        id,
        abbr: user.abbr,
        name: user.name,
        email: user.email,
        role: user.role,
        active,
        hourlyRate,
        startDate,
      })
    )
  }

  @Patch('/:id')
  @Authorized(UserRole.ADMIN)
  async update(
    @CurrentUser() currentUser: UserEntity,
    @Param('id') resourceId: string,
    @Body({ patch: true })
    body: ResourceUpdateBody
  ) {
    await dataSource.transaction(async em => {
      try {
        const resource = await em.findOneOrFail(ResourceEntity, {
          where: { id: resourceId },
          relations: { user: { organization: true } },
        })
        if (resource.user.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        const merged = mergeDeep(resource, {
          active: body.active,
          hourlyRate: body.hourlyRate,
          startDate: body.startDate,
          user: {
            name: body.name,
            abbr: body.abbr,
            isEnabled: body.active,
            role: body.role,
          },
        })
        await em.save(ResourceEntity, {
          ...merged,
        })
      } catch (error) {
        console.log(error)
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

  @Get('/clients')
  async getClients(@CurrentUser() currentUser: UserEntity) {
    try {
      const currentResource = await ResourceEntity.findOneByOrFail({
        user: { id: currentUser.id },
      })
      const [clients, count] = await ClientResourceEntity.findAndCount({
        relations: { client: true },
        where: { resource: { id: currentResource.id } },
      })
      return { clients, count }
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError)
        throw new ForbiddenError('You are not a resource')
      else throw new InternalServerError('Internal Server Error')
    }
  }

  @Get('/:id/clients')
  @Authorized(UserRole.ADMIN)
  async getClientsOf(@Param('id') resourceUserId: string) {
    try {
      const resource = await ResourceEntity.findOneByOrFail({
        id: resourceUserId,
      })
      const clients = await ClientResourceEntity.find({
        relations: { client: true },
        where: { resource: { id: resource.id } },
      })
      return clients
    } catch (error) {
      if (error instanceof EntityNotFoundError)
        throw new ForbiddenError('You are not a resource')
      else throw new InternalServerError('Internal Server Error')
    }
  }

  @Post('/:resourceId/clients/:clientId')
  @Authorized(UserRole.ADMIN)
  async assignClientToResource(
    @CurrentUser() currentUser: UserEntity,
    @Param('resourceId') resourceId: string,
    @Param('clientId') clientId: string
  ) {
    await dataSource.transaction(async em => {
      try {
        const existing = await em.findOne(ClientResourceEntity, {
          where: { resource: { id: resourceId }, client: { id: clientId } },
        })
        if (existing != null) throw new AlreadyExistsError()
        const resource = await em.findOneOrFail(ResourceEntity, {
          where: { id: resourceId },
          relations: { user: true },
        })
        if (resource.user.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        const client = await em.findOneOrFail(ClientEntity, {
          where: { id: clientId },
          relations: { organization: true },
        })
        if (client.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        await em.save(ClientResourceEntity, { client, resource })
      } catch (error) {
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else if (error instanceof AlreadyExistsError)
          throw new AlreadyExistsError('client is already assigned to resource')
        else throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Assigned client to Resource'
  }
}
