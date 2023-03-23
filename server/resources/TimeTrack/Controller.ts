import {
  TT,
  UserRole,
  TTCreateBody,
  TableQueryParameters,
  WorkPeriod,
  TTUpdateBody,
} from 'models'

import {
  Authorized,
  BadRequestError,
  CurrentUser,
  ForbiddenError,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
} from 'routing-controllers'

import UserEntity from '~/resources/User/Entity'

import { Delete, Get, Patch, Post } from '~/decorators/CustomApiMethods'
import TTEntity from '~/resources/TimeTrack/Entity'
import { Body, QueryParams } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'
import { EntityNotFoundError, EntityPropertyNotFoundError } from 'typeorm'
import { ALL_UUID } from '~/common/Config'
import ProjectEntity from '~/resources/Project/Entity'
import ClientEntity from '~/resources/Client/Entity'
import TTBatchCreateResBody from 'models/TimeTrack/res-bodies/TTBatchCreateResBody'
import TTBatchCreateBody from 'models/TimeTrack/req-bodies/TTBatchCreateBody'
import TTGetAllResBody from 'models/TimeTrack/res-bodies/TTGetAllResBody'
import WorkPeriodEntity from '~/resources/WorkPeriod/Entity'

@JsonController('/time-track')
export default class TimeTrackController {
  @Get(TTGetAllResBody)
  @Authorized(UserRole.ADMIN)
  async getAll(
    @CurrentUser() currentUser: UserEntity,
    @QueryParams() { order, take, skip }: TableQueryParameters
  ) {
    let entityObjects: TTEntity[] = []
    let count = 0
    await dataSource.transaction(async em => {
      try {
        ;[entityObjects, count] = await TTEntity.findAndCount({
          where: { user: { id: currentUser.id } },
          relations: { client: true, project: true },
          order,
          take,
          skip,
        })
      } catch (error) {
        if (error instanceof EntityNotFoundError) throw new ForbiddenError()
        else if (error instanceof EntityPropertyNotFoundError) {
          throw new BadRequestError('Invalid column name for sorting')
        } else throw new InternalServerError('Internal Server Error')
      }
    })

    const data = entityObjects.map(
      ({ id, client, description, date, billable, hour, project, ticketNo }) =>
        TT.create({
          id,
          description,
          date,
          clientAbbr: client.abbr,
          billable,
          hour,
          projectAbbr: project.abbr,
          ticketNo,
        })
    )
    return TTGetAllResBody.create({ data, count })
  }

  @Post(String)
  @Authorized(UserRole.ADMIN)
  async create(
    @Body() { clientAbbr, projectAbbr, date, ...body }: TTCreateBody,
    @CurrentUser() currentUser: UserEntity
  ) {
    let id = ''
    const period = WorkPeriod.fromDate(date.dateObject)
    await dataSource.transaction(async em => {
      try {
        await em.findOneOrFail(WorkPeriodEntity, {
          where: {
            period: period.periodString,
            organization: { id: currentUser.organization.id },
          },
        })
        /*
          Throws ForbiddenEror if this client is:
          - Not owned by currentUser's organization
          - Not accessable by the resource
        */

        const client = await em.findOneOrFail(ClientEntity, {
          where: [
            {
              abbr: clientAbbr,
              organization: { id: currentUser.organization.id },
              clientUser: { userId: currentUser.id },
            },
            {
              abbr: clientAbbr,
              organization: { id: currentUser.organization.id },
              clientUser: { userId: ALL_UUID },
            },
          ],
          relations: { organization: true },
        })

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
        id = (
          await em.save(
            TTEntity.create({
              ...body,
              user: currentUser,
              date: date.dateString,
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

  @Patch(undefined, '/:id')
  @Authorized(UserRole.ADMIN)
  async update(
    @Body() { clientAbbr, projectAbbr, date, ...body }: TTUpdateBody,
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity
  ) {
    await dataSource.transaction(async em => {
      try {
        /* Check period of TT */
        const tt = await em.findOneOrFail(TTEntity, {
          where: {
            id,
            user: { organization: { id: currentUser.organization.id } },
          },
          select: { date: true },
        })
        const period = WorkPeriod.fromDate(new Date(tt.date))
        if (
          !(await em.find(WorkPeriodEntity, {
            where: {
              period: period.periodString,
              organization: { id: currentUser.organization.id },
            },
          }))
        )
          throw new ForbiddenError()
        /*
          Throws ForbiddenEror if this client is:
          - Not owned by currentUser's organization
          - Not accessable by the resource
        */

        const client = await em.findOneOrFail(ClientEntity, {
          where: [
            {
              abbr: clientAbbr,
              organization: { id: currentUser.organization.id },
              clientUser: { userId: currentUser.id },
            },
            {
              abbr: clientAbbr,
              organization: { id: currentUser.organization.id },
              clientUser: { userId: ALL_UUID },
            },
          ],
          relations: { organization: true },
        })

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

        await em.update(TTEntity, id, {
          ...body,
          date: date.dateString,
          client,
          project,
        })
      } catch (error) {
        console.log(error)
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })

    return id
  }

  @Delete(undefined, '/:id')
  @Authorized(UserRole.ADMIN)
  async delete(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity
  ) {
    await dataSource.transaction(async em => {
      try {
        /* Check period of TT */
        const tt = await em.findOneOrFail(TTEntity, {
          where: {
            id,
            user: { organization: { id: currentUser.organization.id } },
          },
          select: { date: true },
        })
        const period = WorkPeriod.fromDate(new Date(tt.date))
        if (
          !(await em.find(WorkPeriodEntity, {
            where: {
              period: period.periodString,
              organization: { id: currentUser.organization.id },
            },
          }))
        )
          throw new ForbiddenError()
        await em.delete(TTEntity, { id })
      } catch (error) {
        console.log(error)
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })

    return id
  }

  @Post([TTBatchCreateResBody], '/batch')
  @Authorized(UserRole.ADMIN)
  async batchCreate(
    @Body() { bodies }: TTBatchCreateBody,
    @CurrentUser() currentUser: UserEntity
  ) {
    const resBodies: TTBatchCreateResBody[] = []
    await dataSource.transaction(async em => {
      try {
        for (const { date, ...body } of bodies) {
          const ttPeriod = WorkPeriod.fromDate(date.dateObject)
          if (
            !(await em.findOne(WorkPeriodEntity, {
              where: {
                period: ttPeriod.periodString,
                organization: { id: currentUser.organization.id },
              },
            }))
          ) {
            resBodies.push(
              new TTBatchCreateResBody({ error: 'invalid-period' })
            )
            continue
          }
          // Checking client
          const client = await em.findOne(ClientEntity, {
            where: [
              {
                abbr: body.clientAbbr,
                organization: { id: currentUser.organization.id },
                clientUser: { userId: currentUser.id },
              },
              {
                abbr: body.clientAbbr,
                organization: { id: currentUser.organization.id },
                clientUser: { userId: ALL_UUID },
              },
            ],
            relations: { organization: true },
          })
          if (!client) {
            resBodies.push(
              new TTBatchCreateResBody({ error: 'invalid-client' })
            )
            continue
          }
          // Checking project
          const project = await em.findOne(ProjectEntity, {
            where: [
              {
                abbr: body.projectAbbr,
                organization: { id: currentUser.organization.id },
                clientId: client.id,
              },
              {
                abbr: body.projectAbbr,
                organization: { id: currentUser.organization.id },
                clientId: ALL_UUID,
              },
            ],
            relations: { organization: true },
          })
          if (!project) {
            resBodies.push(
              new TTBatchCreateResBody({ error: 'invalid-project' })
            )
            continue
          }
          // Inserting to table
          const { id } = await em.save(
            TTEntity.create({
              ...body,
              date: date.dateString,
              user: currentUser,
              client,
              project,
            })
          )
          resBodies.push(new TTBatchCreateResBody({ id }))
        }
      } catch (error) {
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
      }
    })
    return resBodies
  }
}
