import { Project, ProjectCreateBody, ProjectUpdateBody, UserRole } from 'models'

import {
  Authorized,
  CurrentUser,
  ForbiddenError,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
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
export default class ProjectController {
  @Get([Project])
  @Authorized(UserRole.ADMIN)
  async getAll(@CurrentUser() currentUser: UserEntity) {
    const entityObjects = await ProjectEntity.find({
      where: { organization: { id: currentUser.organization.id } },
      relations: { client: true },
    })
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
  @Authorized(UserRole.ADMIN)
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
  @Authorized(UserRole.ADMIN)
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
