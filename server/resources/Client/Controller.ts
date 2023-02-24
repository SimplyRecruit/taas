import { Client, ClientUpdateBody, Resource, UserRole } from 'models'
import ClientAddResourceBody from 'models/Client/req-bodies/ClientAddResourceBody'
import ClientCreateBody from 'models/Client/req-bodies/ClientCreateBody'
import {
  Authorized,
  CurrentUser,
  ForbiddenError,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
} from 'routing-controllers'
import { AlreadyExistsError } from 'server/errors/AlreadyExistsError'
import { EntityNotFoundError } from 'typeorm'
import { ALL_UUID } from '~/common/Config'
import { Delete, Get, Patch, Post } from '~/decorators/CustomApiMethods'
import { Body } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'
import ClientEntity from '~/resources/Client/Entity'
import ClientResourceEntity from '~/resources/relations/ClientResource'
import UserEntity from '~/resources/User/Entity'

@JsonController('/client')
@Authorized(UserRole.ADMIN)
export default class ClientController {
  @Get([Client])
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
      ({
        id,
        active,
        name,
        abbr,
        startDate,
        contractDate,
        partnerName,
        contractType,
        clientResource,
      }) =>
        Client.create({
          id,
          active,
          name,
          abbr,
          startDate,
          partnerName,
          contractDate,
          contractType,
          everyoneHasAccess:
            clientResource.length && clientResource[0].resourceId === ALL_UUID
              ? true
              : false,
          resources:
            clientResource.length && clientResource[0].resourceId === ALL_UUID
              ? undefined
              : clientResource.map(
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

  @Patch(undefined, '/:id')
  async update(
    @CurrentUser() currentUser: UserEntity,
    @Param('id') id: string,
    @Body({ patch: true }) body: ClientUpdateBody
  ) {
    await dataSource.transaction(async em => {
      try {
        const client = await em.findOneOrFail(ClientEntity, {
          where: { id },
          relations: { organization: true },
        })

        if (client.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        await em.update(ClientEntity, id, body)
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
    let id
    await dataSource.transaction(async em => {
      const { resourceIds, everyoneHasAccess, ...rest } = body
      try {
        const client = await em.save(
          ClientEntity.create({
            organization: currentUser.organization,
            ...rest,
          })
        )
        if (everyoneHasAccess) {
          // All logic
          await em.save(
            ClientResourceEntity.create({ client, resourceId: ALL_UUID })
          )
        } else if (resourceIds?.length) {
          const clientResources = resourceIds.map(resourceId =>
            ClientResourceEntity.create({ client, resourceId })
          )
          // TODO resources are part of this organization
          await em.insert(ClientResourceEntity, clientResources)
          id = client.id
        }
      } catch (error: any) {
        console.log(error)
        if (error.code == 23505)
          throw new AlreadyExistsError('Abbr already exists')
        throw new InternalServerError('Internal Server Error')
      }
    })
    return id
  }

  @Delete(undefined, '/:id')
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

  @Post(undefined, '/resource/:clientId')
  async addResource(
    @Body() { everyoneHasAccess, resourceIds }: ClientAddResourceBody,
    @Param('clientId') clientId: string,
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

        if (everyoneHasAccess) {
          // All logic
          await em.delete(ClientResourceEntity, { client })
          await em.save(
            ClientResourceEntity.create({ client, resourceId: ALL_UUID })
          )
        } else if (resourceIds?.length) {
          const clientResources = resourceIds.map(resourceId =>
            ClientResourceEntity.create({ client, resourceId })
          )
          // TODO resources are part of this organization
          await em.insert(ClientResourceEntity, clientResources)
        }
      } catch (error) {
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Client Deletion Successful'
  }

  @Delete(undefined, '/:clientId/resource/:resourceId')
  async removeResource(
    @Param('clientId') clientId: string,
    @Param('resourceId') resourceId: string,
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
        await em.delete(ClientResourceEntity, { client, resourceId })
      } catch (error) {
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Client Deletion Successful'
  }

  @Get(undefined, '/:id/resources')
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
