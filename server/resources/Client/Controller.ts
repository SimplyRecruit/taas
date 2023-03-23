import {
  Client,
  ClientUpdateBody,
  type EntityStatus,
  Resource,
  UserRole,
} from 'models'
import ClientUpdateAccessBody from 'models/Client/req-bodies/ClientUpdateAccessBody'
import ClientCreateBody from 'models/Client/req-bodies/ClientCreateBody'
import {
  Authorized,
  CurrentUser,
  ForbiddenError,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
  QueryParam,
} from 'routing-controllers'
import { AlreadyExistsError } from 'server/errors/AlreadyExistsError'
import { EntityNotFoundError } from 'typeorm'
import { ALL_UUID } from '~/common/Config'
import { Delete, Get, Patch, Post } from '~/decorators/CustomApiMethods'
import { Body } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'
import ClientEntity from '~/resources/Client/Entity'
import ClientUserEntity from '~/resources/relations/ClientResource'
import UserEntity from '~/resources/User/Entity'

@JsonController('/client')
@Authorized(UserRole.ADMIN)
export default class ClientController {
  @Get([Client])
  async getAll(
    @CurrentUser() currentUser: UserEntity,
    @QueryParam('entityStatus') entityStatus: EntityStatus
  ) {
    const query: any = {
      where: { organization: { id: currentUser.organization.id } },
      relations: { clientUser: { user: true } },
    }
    if (entityStatus == 'active') query.where.active = true
    else if (entityStatus == 'archived') query.where.active = false
    const rows = await ClientEntity.find(query)
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
        clientUser,
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
            clientUser.length && clientUser[0].userId === ALL_UUID
              ? true
              : false,
          resources:
            clientUser.length && clientUser[0].userId === ALL_UUID
              ? undefined
              : clientUser.map(
                  ({
                    user: {
                      id,
                      abbr,
                      name,
                      email,
                      role,
                      active,
                      startDate,
                      hourlyRate,
                    },
                  }) =>
                    Resource.create({
                      id,
                      abbr,
                      name,
                      email,
                      role,
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

  @Post(String)
  async create(
    @CurrentUser() currentUser: UserEntity,
    @Body() body: ClientCreateBody
  ) {
    let id
    await dataSource.transaction(async em => {
      const { userIds, everyoneHasAccess, ...rest } = body
      try {
        const client = await em.save(
          ClientEntity.create({
            organization: currentUser.organization,
            ...rest,
          })
        )
        id = client.id
        if (everyoneHasAccess) {
          // All logic
          await em.save(ClientUserEntity.create({ client, userId: ALL_UUID }))
        } else if (userIds?.length) {
          const clientResources = userIds.map(userId =>
            ClientUserEntity.create({ client, userId })
          )
          // TODO resources are part of this organization
          await em.insert(ClientUserEntity, clientResources)
        }
      } catch (error: any) {
        console.log({ error })
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
  async updateAccess(
    @Body() { everyoneHasAccess, userIds }: ClientUpdateAccessBody,
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
          await em.delete(ClientUserEntity, { client })
          await em.save(ClientUserEntity.create({ client, userId: ALL_UUID }))
        } else if (userIds?.length) {
          const clientResources = userIds.map(userId =>
            ClientUserEntity.create({ client, userId })
          )
          await em.delete(ClientUserEntity, {
            client,
            userId: ALL_UUID,
          })
          // TODO resources are part of this organization
          await em.insert(ClientUserEntity, clientResources)
        }
      } catch (error) {
        console.log(error)
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Client Deletion Successful'
  }

  @Delete(undefined, '/:clientId/resource/:userId')
  async removeResource(
    @Param('clientId') clientId: string,
    @Param('userId') userId: string,
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
        await em.delete(ClientUserEntity, { client, userId })
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
      const [users, count] = await ClientUserEntity.findAndCount({
        relations: { user: true },
        where: { client: { id: client.id } },
      })
      return { users, count }
    } catch (error) {
      console.log(error)
      if (error instanceof EntityNotFoundError) throw new NotFoundError()
      else if (error instanceof ForbiddenError) throw new ForbiddenError()
      else throw new InternalServerError('Internal Server Error')
    }
  }
}
