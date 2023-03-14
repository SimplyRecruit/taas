import { ReportReqBody, UserRole } from 'models'

import { Authorized, CurrentUser, JsonController } from 'routing-controllers'

import UserEntity from '~/resources/User/Entity'

import { Post } from '~/decorators/CustomApiMethods'

import { Body } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'
import TimeTrackEntity from '~/resources/TimeTrack/Entity'
import Report from 'models/Report/Report'

@JsonController('/report')
export default class ReportController {
  @Post([Report])
  @Authorized(UserRole.ADMIN)
  async get(
    @Body()
    { from, to, billable, clientIds, projectIds, userIds }: ReportReqBody,
    @CurrentUser() currentUser: UserEntity
  ) {
    let t: Report[] = []
    await dataSource.transaction(async em => {
      let query = em
        .createQueryBuilder()
        .select(`DATE_TRUNC('day', tt.date)`, 'date')
        .addSelect('BOOL_OR(tt.billable)', 'billable')
        .addSelect('SUM(tt.hour)', 'totalHours')
        .from(TimeTrackEntity, 'tt')
        .innerJoin(UserEntity, 'user', 'user.id = tt.user_id')
        .where('tt.date BETWEEN :from AND :to ', { from, to })
        .groupBy(`DATE_TRUNC('day', tt.date)`)
        .addGroupBy('tt.billable')
        .orderBy('date')

      if (userIds && userIds.length) {
        query = query.andWhere('tt.user_id IN (:...userIds)', {
          userIds,
        })
      } else {
        query = query.andWhere('tt.user_id = :userId', {
          userId: currentUser.id,
        })
      }
      if (clientIds && clientIds.length) {
        query = query.andWhere('tt.client_id IN (:...clientIds)', {
          clientIds,
        })
      }
      if (projectIds && projectIds.length) {
        query = query.andWhere('tt.project_id IN (:...projectIds)', {
          projectIds,
        })
      }
      if (typeof billable === 'boolean') {
        query = query.andWhere('tt.billable = :billable', {
          billable: billable,
        })
      }
      t = await query.printSql().getRawMany()
      console.log(t)
    })

    return t
  }
}
