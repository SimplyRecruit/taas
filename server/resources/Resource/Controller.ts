import { Resource, UserRole } from 'models'
import ResourceUpdateBody from 'models/Resource/req-bodies/ResourceUpdateBody'
import {
  Authorized,
  CurrentUser,
  ForbiddenError,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
} from 'routing-controllers'
import { EntityNotFoundError } from 'typeorm'
import { Body } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'
import ClientUserEntity from '~/resources/relations/ClientResource'
import UserEntity from '~/resources/User/Entity'
import { Get, Patch } from '~/decorators/CustomApiMethods'

@JsonController('/resource')
export default class ResourceController {
  @Get([Resource])
  @Authorized(UserRole.ADMIN)
  async getAll(@CurrentUser() currentUser: UserEntity) {
    const entityObjects = await UserEntity.find({
      where: { organization: { id: currentUser.organization.id } },
    })
    return entityObjects.map(
      ({ id, abbr, name, email, role, active, startDate, hourlyRate }) =>
        Resource.create({
          id,
          abbr,
          name,
          email,
          role,
          active,
          hourlyRate,
          startDate,
        })
    )
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

  @Get(undefined, '/clients')
  async getClients(@CurrentUser() currentUser: UserEntity) {
    try {
      const [clients, count] = await ClientUserEntity.findAndCount({
        relations: { client: true },
        where: { user: { id: currentUser.id } },
      })
      return { clients, count }
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
