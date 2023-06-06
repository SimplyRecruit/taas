import {
  TT,
  UserRole,
  TTCreateBody,
  WorkPeriod,
  TTUpdateBody,
  TTGetAllParams,
} from 'models'

import {
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
import { EntityNotFoundError, EntityPropertyNotFoundError, In } from 'typeorm'
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
  async getAll(
    @CurrentUser() currentUser: UserEntity,
    @QueryParams() { order, take, skip, userIds }: TTGetAllParams
  ) {
    const me = !(userIds && userIds.length)
    try {
      let ttUserIds
      if (me) ttUserIds = [currentUser.id]
      else if (currentUser.role != UserRole.ADMIN) throw new ForbiddenError()
      else ttUserIds = userIds
      const [entityObjects, count] = await TTEntity.findAndCount({
        where: {
          user: {
            organization: { id: currentUser.organization.id },
            id: ttUserIds[0] == 'all' ? undefined : In(ttUserIds),
          },
        },
        relations: { user: !me, client: true, project: true },
        order,
        take,
        skip,
        select: {
          id: true,
          description: true,
          date: true,
          billable: true,
          hour: true,
          ticketNo: true,
          user: {
            abbr: !me,
          },
        },
      })

      return TTGetAllResBody.create({
        data: entityObjects.map(({ client, project, user, ...rest }) =>
          TT.create({
            clientAbbr: client.abbr,
            projectAbbr: project.abbr,
            userAbbr: user?.abbr,
            ...rest,
          })
        ),
        count,
      })
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw new ForbiddenError()
      else if (error instanceof EntityPropertyNotFoundError) {
        throw new BadRequestError('Invalid column name for sorting')
      } else throw new InternalServerError('Internal Server Error')
    }
  }

  @Patch(undefined, '/:id')
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
            user:
              currentUser.role == UserRole.ADMIN
                ? { organization: { id: currentUser.organization.id } }
                : { id: currentUser.id },
          },
          select: {
            id: true,
            date: true,
            user: { id: true },
            client: { abbr: true },
            project: { abbr: true },
          },
          relations: { client: true, project: true, user: true },
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
        let client = undefined
        if (tt.client.abbr != clientAbbr) {
          // if client not changed, no need to control
          client = await em.findOneOrFail(ClientEntity, {
            where: [
              {
                abbr: clientAbbr,
                organization: { id: currentUser.organization.id },
                clientUser: { userId: tt.user.id },
                active: true,
              },
              {
                abbr: clientAbbr,
                organization: { id: currentUser.organization.id },
                clientUser: { userId: ALL_UUID },
                active: true,
              },
            ],
            relations: { organization: true },
          })
        }

        /*
          Throws ForbiddenEror if this project is:
          - Not owned by currentUser's organization
          - Not accessable by the given clintId
        */
        let project = undefined
        if (tt.client.abbr != clientAbbr || tt.project.abbr != projectAbbr) {
          // if client or project not changed, no need to control
          project = await em.findOneOrFail(ProjectEntity, {
            where: [
              {
                abbr: projectAbbr,
                organization: { id: currentUser.organization.id },
                client: {
                  abbr: clientAbbr,
                  organization: { id: currentUser.organization.id },
                },
                active: tt.project.abbr != projectAbbr ? true : undefined,
              },
              // if project changed, need to check if the new one is active
              {
                abbr: projectAbbr,
                organization: { id: currentUser.organization.id },
                clientId: ALL_UUID,
                active: tt.project.abbr != projectAbbr ? true : undefined,
              },
            ],
            relations: { organization: true },
          })
        }

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
            user:
              currentUser.role == UserRole.ADMIN
                ? { organization: { id: currentUser.organization.id } }
                : { id: currentUser.id },
          },
          select: { id: true, date: true },
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

  @Post([TTBatchCreateResBody], '/batch/:userId')
  async batchCreate(
    @Body() { bodies }: TTBatchCreateBody,
    @Param('userId') userId: string,
    @CurrentUser() currentUser: UserEntity
  ) {
    const resBodies: TTBatchCreateResBody[] = []
    let ttUserId: string
    if (userId == 'me') ttUserId = currentUser.id
    else if (currentUser.role != UserRole.ADMIN) throw new ForbiddenError()
    else {
      ;({ id: ttUserId } = await UserEntity.findOneOrFail({
        where: {
          id: userId,
          organization: { id: currentUser.organization.id },
          active: true,
        },
        select: { id: true },
      }))
    }

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
            where: {
              abbr: body.clientAbbr,
              organization: { id: currentUser.organization.id },
              clientUser: { userId: In([ALL_UUID, ttUserId]) },
              active: true,
            },

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
            where: {
              abbr: body.projectAbbr,
              organization: { id: currentUser.organization.id },
              clientId: In([ALL_UUID, client.id]),
              active: true,
            },
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
              user: { id: ttUserId },
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
