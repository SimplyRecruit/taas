import {
  type EntityStatus,
  Resource,
  UserRole,
  ClientRelation,
  ProjectRelation,
} from 'models'
import ResourceUpdateBody from 'models/Resource/req-bodies/ResourceUpdateBody'
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
import { EntityNotFoundError, In } from 'typeorm'
import { Body } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'
import ClientUserEntity from '~/resources/relations/ClientResource'
import UserEntity from '~/resources/User/Entity'
import { Get, Patch } from '~/decorators/CustomApiMethods'
import { ALL_UUID } from '~/common/Config'
import ProjectEntity from '~/resources/Project/Entity'
import ClientEntity from '~/resources/Client/Entity'
import GetClientsAndProjectsResBody from 'models/Resource/res-bodies/GetClients&ProjectsResBody'

@JsonController('/resource')
export default class ResourceController {
  @Get([Resource])
  @Authorized(UserRole.ADMIN)
  async getAll(
    @CurrentUser() currentUser: UserEntity,
    @QueryParam('entityStatus') entityStatus: EntityStatus
  ) {
    const query: any = {
      where: { organization: { id: currentUser.organization.id } },
      select: {
        id: true,
        abbr: true,
        name: true,
        email: true,
        role: true,
        active: true,
        hourlyRate: true,
        startDate: true,
      },
    }
    if (entityStatus == 'active') query.where.active = true
    else if (entityStatus == 'archived') query.where.active = false
    return UserEntity.find(query)
  }

  @Patch(String, '/:id')
  @Authorized(UserRole.ADMIN)
  async update(
    @CurrentUser() currentUser: UserEntity,
    @Param('id') userId: string,
    @Body({ patch: true })
    body: ResourceUpdateBody
  ) {
    await dataSource.transaction(async em => {
      try {
        const user = await em.findOneOrFail(UserEntity, {
          where: { id: userId },
          relations: { organization: true },
        })
        if (user.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        await em.save(UserEntity, {
          ...user,
          ...body,
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

  @Get(undefined, '/clients-and-projects')
  async getClientsAndProjects(@CurrentUser() currentUser: UserEntity) {
    try {
      const clients = (await ClientEntity.find({
        where: {
          organization: { id: currentUser.organization.id },
          clientUser: { user: { id: In([ALL_UUID, currentUser.id]) } },
          active: true,
        },
        select: {
          id: true,
          abbr: true,
          name: true,
        },
      })) as ClientRelation[]

      const projects = (await ProjectEntity.find({
        where: {
          organization: { id: currentUser.organization.id },
          clientId: In([ALL_UUID, ...clients.map(e => e.id)]),
          active: true,
        },
        select: {
          id: true,
          name: true,
          abbr: true,
        },
      })) as ProjectRelation[]

      return { clients, projects } as GetClientsAndProjectsResBody
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError)
        throw new ForbiddenError('You are not a resource')
      else throw new InternalServerError('Internal Server Error')
    }
  }

  @Get(undefined, '/:id/clients')
  @Authorized(UserRole.ADMIN)
  async getClientsOf(
    @CurrentUser() currentUser: UserEntity,
    @Param('id') userId: string
  ) {
    try {
      const clients = await ClientUserEntity.find({
        relations: { client: true },
        where: {
          user: {
            id: userId,
            organization: { id: currentUser.organization.id },
          },
        },
      })
      return clients
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new NotFoundError()
      else throw new InternalServerError('Internal Server Error')
    }
  }
}
