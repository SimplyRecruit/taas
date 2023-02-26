import {
  Client,
  TT,
  ProjectCreateBody,
  ProjectUpdateBody,
  UserRole,
  TTCreateBody,
} from 'models'

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
import TTEntity from '~/resources/TimeTrack/Entity'
import { Body } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'
import ClientEntity from '~/resources/Client/Entity'
import { EntityNotFoundError } from 'typeorm'
import { ALL_UUID } from '~/common/Config'
import ProjectEntity from '~/resources/Project/Entity'
import ClientResourceEntity from '~/resources/relations/ClientResource'

@JsonController('/project')
export default class ProjectController {
  @Get([TT])
  @Authorized(UserRole.ADMIN)
  async getAll(@CurrentUser() currentUser: UserEntity) {
    const entityObjects = await TTEntity.find({
      where: { resource: { id: currentUser.resource.id } },
      relations: { client: true, project: true },
    })
    return entityObjects.map(
      ({ id, client, description, date, billable, hour, project, ticketNo }) =>
        TT.create({
          id,
          description,
          date,
          client: { id: client.id, abbr: client.abbr, name: client.name },
          billable,
          hour,
          project,
          ticketNo,
        })
    )
  }

  @Post()
  @Authorized(UserRole.ADMIN)
  async create(
    @Body() { clientId, projectId, ...body }: TTCreateBody,
    @CurrentUser() currentUser: UserEntity
  ) {
    let id
    console.log(clientId, body)
    await dataSource.transaction(async em => {
      try {
        /*
          Throws ForbiddenEror if this client is:
          - Not owned by currentUser's organization
          - Not accessable by the resource
        */
        const { client } = await em.findOneOrFail(ClientResourceEntity, {
          where: [
            { clientId, resourceId: currentUser.resource.id },
            { clientId, resourceId: ALL_UUID },
          ],
          relations: { client: { organization: true } },
        })
        if (
          client.id != ALL_UUID ||
          client.organization.id != currentUser.organization.id
        )
          throw new ForbiddenError()

        /*
          Throws ForbiddenEror if this project is:
          - Not owned by currentUser's organization
          - Not accessable by the given clintId
        */
        const project = await em.findOneOrFail(ProjectEntity, {
          where: [
            { id: projectId, clientId },
            { id: projectId, clientId: ALL_UUID },
          ],
          relations: { organization: true },
        })
        if (project.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()

        id = (
          await em.save(
            TTEntity.create({
              ...body,
              resource: currentUser.resource,
              client,
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
}
