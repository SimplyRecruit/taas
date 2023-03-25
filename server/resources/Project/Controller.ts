import {
  type EntityStatus,
  Project,
  ProjectCreateBody,
  ProjectUpdateBody,
  UserRole,
} from 'models'

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

import UserEntity from '~/resources/User/Entity'

import { Get, Patch, Post } from '~/decorators/CustomApiMethods'
import ProjectEntity from '~/resources/Project/Entity'
import { Body } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'
import ClientEntity from '~/resources/Client/Entity'
import { EntityNotFoundError } from 'typeorm'
import { ALL_UUID } from '~/common/Config'

@JsonController('/project')
@Authorized(UserRole.ADMIN)
export default class ProjectController {
  @Get([Project])
  async getAll(
    @CurrentUser() currentUser: UserEntity,
    @QueryParam('entityStatus') entityStatus: EntityStatus
  ) {
    const query: any = {
      where: { organization: { id: currentUser.organization.id } },
      relations: { client: true },
    }
    if (entityStatus == 'active') query.where.active = true
    else if (entityStatus == 'archived') query.where.active = false
    const entityObjects = await ProjectEntity.find(query)
    return entityObjects.map(({ id, abbr, active, client, name, startDate }) =>
      Project.create({
        id,
        abbr,
        name,
        startDate,
        client,
        active,
      })
    )
  }

  @Post()
  async create(
    @Body() { clientId, ...body }: ProjectCreateBody,
    @CurrentUser() currentUser: UserEntity
  ) {
    let id
    console.log(clientId, body)
    await dataSource.transaction(async em => {
      try {
        const client = await em.findOneOrFail(ClientEntity, {
          where: { id: clientId },
          relations: { organization: true },
        })
        if (
          clientId != ALL_UUID &&
          client.organization.id !== currentUser.organization.id
        )
          throw new ForbiddenError()

        id = (
          await em.save(
            ProjectEntity.create({
              ...body,
              client,
              organization: currentUser.organization,
            })
          )
        ).id
      } catch (error) {
        console.log(error)
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })

    return id
  }

  @Patch(undefined, '/:id')
  async update(
    @Param('id') id: string,
    @Body({ patch: true }) { clientId, ...body }: ProjectUpdateBody,
    @CurrentUser() currentUser: UserEntity
  ) {
    await dataSource.transaction(async em => {
      try {
        let updateBody: any = body
        if (clientId) {
          const client = await em.findOneOrFail(ClientEntity, {
            where: { id: clientId },
            relations: { organization: true },
          })
          if (
            clientId != ALL_UUID &&
            client.organization.id !== currentUser.organization.id
          )
            throw new ForbiddenError()
          updateBody = { client, ...body }
        }

        await em.update(ProjectEntity, id, updateBody)
      } catch (error) {
        console.log(error)
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })

    return 'Updated'
  }
}
