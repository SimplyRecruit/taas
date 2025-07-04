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
export default class ClientController {
  @Authorized(UserRole.ADMIN)
  @Get([Client])
  async getAll(
    @CurrentUser() currentUser: UserEntity,
    @QueryParam('entityStatus') entityStatus: EntityStatus
  ) {
    let active = undefined
    if (entityStatus == 'active') active = true
    else if (entityStatus == 'archived') active = false

    const rows = await ClientEntity.find({
      where: {
        organization: { id: currentUser.organization.id },
        active,
      },
      relations: { clientUser: { user: true } },
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
                      status,
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
                      status,
                    })
                ),
        })
    )
  }

  @Authorized(UserRole.ADMIN)
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

  @Authorized(UserRole.ADMIN)
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

  @Authorized(UserRole.ADMIN)
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

  @Authorized(UserRole.ADMIN)
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
        } else {
          await em.delete(ClientUserEntity, {
            client,
            userId: ALL_UUID,
          })
          if (userIds?.length) {
            const clientUsers = userIds.map(userId =>
              ClientUserEntity.create({ client, userId })
            )
            // TODO resources are part of this organization
            await em.insert(ClientUserEntity, clientUsers)
          }
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

  @Authorized(UserRole.ADMIN)
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

  @Authorized(UserRole.ADMIN)
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

  @Authorized()
  @Get([String], '/partner-names')
  async getUniquePartnerNames(
    @QueryParam('isMe') isMe: boolean,
    @CurrentUser() currentUser: UserEntity
  ) {
    try {
      const organizationId = currentUser.organization.id

      const query = ClientEntity.createQueryBuilder('client')
        .select('DISTINCT client.partner_name', 'partnerName')
        .where('client.organization_id = :organizationId', {
          organizationId,
        })

      // if (isMe || currentUser.role !== UserRole.ADMIN) {
      //  query = query
      //   .innerJoin(
      //    ClientUserEntity,
      //   'client_user',
      //   'client_user.client_id = client.id'
      // )
      // .andWhere('client_user.user_id = :userId', { userId: currentUser.id })
      //  }

      const uniquePartnerNames = await query.getRawMany()

      return uniquePartnerNames.map(e => e.partnerName).filter(e => !!e)
    } catch (error) {
      console.log(error)
      if (error instanceof EntityNotFoundError) throw new NotFoundError()
      else if (error instanceof ForbiddenError) throw new ForbiddenError()
      else throw new InternalServerError('Internal Server Error')
    }
  }
}
