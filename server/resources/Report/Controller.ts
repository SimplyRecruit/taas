import { ReportReqBody, UserRole } from 'models'

import { Authorized, CurrentUser, JsonController } from 'routing-controllers'

import UserEntity from '~/resources/User/Entity'

import { Post } from '~/decorators/CustomApiMethods'

import { Body } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'

import TimeTrackEntity from '~/resources/TimeTrack/Entity'
import ResourceEntity from '~/resources/Resource/Entity'

@JsonController('/report')
export default class ReportController {
  @Post(undefined)
  @Authorized(UserRole.ADMIN)
  async get(
    @Body({ patch: true }) { from, to, billable }: ReportReqBody,
    @CurrentUser() currentUser: UserEntity
  ) {
    let t
    await dataSource.transaction(async em => {
      const currentResource = await em.findOneByOrFail(ResourceEntity, {
        user: { id: currentUser.id },
      })
      let query = em
        .createQueryBuilder()
        .select(`DATE_TRUNC('day', tt.date)`, 'date')
        .addSelect('BOOL_OR(tt.billable)', 'billable')
        .addSelect('SUM(tt.hour)', 'totalHours')
        .from(TimeTrackEntity, 'tt')
        .innerJoin(ResourceEntity, 'resource', 'resource.id = tt.resource_id')
        .where('resource.id = :resourceId', {
          resourceId: currentResource.id,
        })
        .andWhere('tt.date BETWEEN :from AND :to ', { from, to })
        .groupBy(`DATE_TRUNC('day', tt.date)`)
        .addGroupBy('tt.billable')
        .orderBy('date')
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
