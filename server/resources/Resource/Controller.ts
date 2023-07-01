import { type EntityStatus, Resource, UserRole } from 'models'
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
import { EntityNotFoundError } from 'typeorm'
import { Body } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'
import UserEntity from '~/resources/User/Entity'
import { Get, Patch } from '~/decorators/CustomApiMethods'
import GetClientsAndProjectsResBody from 'models/Resource/res-bodies/GetClients&ProjectsResBody'
import { getClientsAndProjectsOf } from '~/resources/Resource/Service'

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
        status: true,
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

  @Get(GetClientsAndProjectsResBody, '/:id/clients-and-projects')
  async getClientsAndProjects(
    @Param('id') userId: string,
    @CurrentUser() currentUser: UserEntity
  ) {
    try {
      if (userId == 'me')
        return getClientsAndProjectsOf(
          currentUser.organization.id,
          currentUser.id
        )
      // do not allow to see other's
      if (currentUser.role == UserRole.END_USER) throw new ForbiddenError()
      return getClientsAndProjectsOf(currentUser.organization.id, userId)
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError)
        throw new ForbiddenError('You are not a resource')
      else if (error instanceof ForbiddenError) throw new ForbiddenError()
      else throw new InternalServerError('Internal Server Error')
    }
  }
}
