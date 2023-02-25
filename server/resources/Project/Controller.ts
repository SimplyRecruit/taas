import { Client, Project, ProjectCreateBody, UserRole } from 'models'

import {
  Authorized,
  CurrentUser,
  ForbiddenError,
  InternalServerError,
  JsonController,
  NotFoundError,
} from 'routing-controllers'

import UserEntity from '~/resources/User/Entity'

import { Get, Post } from '~/decorators/CustomApiMethods'
import ProjectEntity from '~/resources/Project/Entity'
import { Body } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'
import ClientEntity from '~/resources/Client/Entity'
import { EntityNotFoundError } from 'typeorm'

@JsonController('/project')
export default class ProjectController {
  @Get([Project])
  @Authorized(UserRole.ADMIN)
  async getAll(@CurrentUser() currentUser: UserEntity) {
    const entityObjects = await ProjectEntity.find({
      where: { organization: { id: currentUser.organization.id } },
      relations: { client: true },
    })
    console.log(entityObjects)
    return entityObjects
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
        if (client.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        if (client.organization)
          id = await em.save(
            ProjectEntity.create({
              ...body,
              client,
              organization: currentUser.organization,
            })
          )
      } catch (error) {
        console.log(error)
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })

    return id
  }
}
