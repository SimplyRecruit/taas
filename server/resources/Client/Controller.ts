import { Client, Resource, UserRole } from 'models'
import ClientCreateBody from 'models/Client/req-bodies/ClientCreateBody'
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
import { AlreadyExistsError } from 'server/errors/AlreadyExistsError'
import { EntityNotFoundError } from 'typeorm'
import { Body } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'
import ClientEntity from '~/resources/Client/Entity'
import ClientResourceEntity from '~/resources/relations/ClientResource'
import UserEntity from '~/resources/User/Entity'

@JsonController('/client')
@Authorized(UserRole.ADMIN)
export default class ClientController {
  @Get()
  async getAll(@CurrentUser() currentUser: UserEntity) {
    const rows = await ClientEntity.find({
      where: {
        organization: { id: currentUser.organization.id },
      },
      relations: {
        clientResource: { resource: { user: true } },
      },
    })
    return rows.map(
      ({ id, active, name, abbr, startDate, contractType, clientResource }) =>
        Client.create({
          id,
          active,
          name,
          abbr,
          startDate,
          contractType,
          everyoneHasAccess:
            clientResource.length && clientResource[0].resourceId === '0'
              ? true
              : false,
          resources: clientResource.map(
            ({ resource: { id, user, active, startDate, hourlyRate } }) =>
              Resource.create({
                id,
                abbr: user.abbr,
                name: user.name,
                email: user.email,
                role: user.role,
                active,
                startDate,
                hourlyRate,
              })
          ),
        })
    )
  }

  @Patch('/:id')
  async update(
    @CurrentUser() currentUser: UserEntity,
    @Param('id') clientId: string,
    @Body({ validate: { skipMissingProperties: true } }) body: Client
  ) {
    await dataSource.transaction(async em => {
      try {
        const client = await em.findOneOrFail(ClientEntity, {
          where: { id: clientId },
          relations: { organization: true },
        })
        if (client.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        await em.update(ClientEntity, clientId, body)
      } catch (error: unknown) {
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Client Update Successful'
  }

  @Post()
  async create(
    @CurrentUser() currentUser: UserEntity,
    @Body() body: ClientCreateBody
  ) {
    await dataSource.transaction(async em => {
      try {
        const { resourceIds, ...rest } = body
        const client = await em.save(
          ClientEntity.create({
            organization: currentUser.organization,
            ...rest,
          })
        )
        if (resourceIds?.length) {
          const clientResources = resourceIds.map(resourceId =>
            ClientResourceEntity.create({ client, resourceId })
          )
          await em.insert(ClientResourceEntity, clientResources)
        }
      } catch (error: any) {
        console.log(error)
        if (error.code == 23505)
          throw new AlreadyExistsError('Abbr already exists')
        throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Client Creation Successful'
  }

  @Delete('/:id')
  async delete(
    @Param('id') clientId: string,
    @CurrentUser() currentUser: UserEntity
  ) {
    await dataSource.transaction(async em => {
      try {
        const client = await em.findOneOrFail(ClientEntity, {
          where: { id: clientId },
          relations: { organization: true },
        })
        if (client.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        await em.remove(client)
      } catch (error) {
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Client Deletion Successful'
  }

  @Get('/:id/resources')
  async getResourcesOf(
    @CurrentUser() currentUser: UserEntity,
    @Param('id') clientId: string
  ) {
    try {
      const client = await ClientEntity.findOneOrFail({
        where: { id: clientId },
        relations: { organization: true },
      })
      if (client.organization.id !== currentUser.organization.id)
        throw new ForbiddenError()
      const [resources, count] = await ClientResourceEntity.findAndCount({
        relations: { resource: true },
        where: { client: { id: client.id } },
      })
      return { resources, count }
    } catch (error) {
      console.log(error)
      if (error instanceof EntityNotFoundError) throw new NotFoundError()
      else if (error instanceof ForbiddenError) throw new ForbiddenError()
      else throw new InternalServerError('Internal Server Error')
    }
  }
}
