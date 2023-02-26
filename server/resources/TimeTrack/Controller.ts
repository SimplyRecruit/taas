import { TT, UserRole, TTCreateBody } from 'models'

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
import { EntityNotFoundError } from 'typeorm'
import { ALL_UUID } from '~/common/Config'
import ProjectEntity from '~/resources/Project/Entity'
import ClientResourceEntity from '~/resources/relations/ClientResource'
import ResourceEntity from '~/resources/Resource/Entity'
import ClientEntity from '~/resources/Client/Entity'

@JsonController('/time-track')
export default class TimeTrackController {
  @Get([TT])
  @Authorized(UserRole.ADMIN)
  async getAll(@CurrentUser() currentUser: UserEntity) {
    let entityObjects: TTEntity[] = []
    await dataSource.transaction(async em => {
      const resource = await em.findOneOrFail(ResourceEntity, {
        where: { userId: currentUser.id },
      })
      entityObjects = await TTEntity.find({
        where: { resource: { id: resource.id } },
        relations: { client: true, project: true },
      })
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
    @Body() { clientAbbr, projectAbbr, ...body }: TTCreateBody,
    @CurrentUser() currentUser: UserEntity
  ) {
    let id
    console.log(clientAbbr, body)
    await dataSource.transaction(async em => {
      try {
        /*
          Throws ForbiddenEror if this client is:
          - Not owned by currentUser's organization
          - Not accessable by the resource
        */
        const resource = await em.findOneOrFail(ResourceEntity, {
          where: { userId: currentUser.id },
        })

        const client = await em.findOneOrFail(ClientEntity, {
          where: [
            {
              abbr: clientAbbr,
              organization: { id: currentUser.organization.id },
              clientResource: { resourceId: resource.id },
            },
            {
              abbr: clientAbbr,
              organization: { id: currentUser.organization.id },
              clientResource: { resourceId: ALL_UUID },
            },
          ],
          relations: { organization: true },
        })

        if (client.organization.id != currentUser.organization.id)
          throw new ForbiddenError()

        /*
          Throws ForbiddenEror if this project is:
          - Not owned by currentUser's organization
          - Not accessable by the given clintId
        */
        const project = await em.findOneOrFail(ProjectEntity, {
          where: [
            {
              abbr: projectAbbr,
              organization: { id: currentUser.organization.id },
              clientId: client.id,
            },
            {
              abbr: projectAbbr,
              organization: { id: currentUser.organization.id },
              clientId: ALL_UUID,
            },
          ],
          relations: { organization: true },
        })
        if (project.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()

        id = (
          await em.save(
            TTEntity.create({
              ...body,
              resource,
              client,
              project,
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
