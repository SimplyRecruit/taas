import { ReportReqBody, Report } from 'models'
import { dataSource } from '~/main'
import ClientEntity from '~/resources/Client/Entity'
import TimeTrackEntity from '~/resources/TimeTrack/Entity'
import UserEntity from '~/resources/User/Entity'

export async function getReport(
  organizationId: string,
  {
    from,
    to,
    billable,
    clientIds,
    projectIds,
    userIds,
    partnerNames,
  }: ReportReqBody
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
      .innerJoin(ClientEntity, 'client', 'client.id = tt.client_id')
      .where('user.organization_id = :organizationId', {
        organizationId,
      })
      .andWhere('tt.date BETWEEN :from AND :to ', { from, to })
      .groupBy(`DATE_TRUNC('day', tt.date)`)
      .addGroupBy('tt.billable')
      .orderBy('date')

    if (userIds && userIds.length) {
      query = query.andWhere('tt.user_id IN (:...userIds)', {
        userIds,
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
    if (partnerNames && partnerNames.length) {
      query = query.andWhere('client.partner_name IN (:...partnerNames)', {
        partnerNames,
      })
    }
    if (typeof billable === 'boolean') {
      query = query.andWhere('tt.billable = :billable', {
        billable,
      })
    }
    t = await query.printSql().getRawMany()
    console.log(t)
  })

  return t
}
