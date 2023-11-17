import { SorterResult } from 'antd/es/table/interface'
import { IsArray, IsBoolean, IsDate, IsOptional } from 'class-validator'
import TableQueryParameters from 'models/common/TableQueryParameters'
import TT from 'models/TimeTrack/TT'
export default class TTGetAllParams extends TableQueryParameters {
  @IsArray()
  @IsOptional()
  userIds?: string[]
  @IsArray()
  @IsOptional()
  clientIds?: string[]
  @IsArray()
  @IsOptional()
  projectIds?: string[]
  @IsArray()
  @IsOptional()
  billableValues?: boolean[]
  @IsBoolean()
  isMe: boolean
  @IsOptional()
  @IsDate()
  dateAfter?: Date
  @IsOptional()
  @IsDate()
  dateBefore?: Date

  public static create({
    sortBy,
    pageSize,
    page,
    userIds,
    clientIds,
    projectIds,
    billableValues,
    isMe,
    dateAfter,
    dateBefore,
  }: {
    sortBy?: { column: string; direction: 'ASC' | 'DESC' }[]
    pageSize: number
    page: number
    userIds?: string[]
    clientIds?: string[]
    projectIds?: string[]
    billableValues?: boolean[]
    isMe: boolean
    dateAfter?: Date
    dateBefore?: Date
  }) {
    const instance = TableQueryParameters.create({
      sortBy,
      pageSize,
      page,
    }) as TTGetAllParams
    instance.userIds = userIds
    instance.clientIds = clientIds
    instance.projectIds = projectIds
    instance.billableValues = billableValues
    instance.isMe = isMe
    instance.dateAfter = dateAfter
    instance.dateBefore = dateBefore
    return instance
  }

  public static createFromParams(
    pageParam: number,
    pageSizeParam: number,
    sorterParam: SorterResult<TT> | undefined,
    filtersParam: any,
    isMe: boolean,
    dateFilter: [Date | undefined, Date | undefined]
  ) {
    let sortBy: { column: string; direction: 'ASC' | 'DESC' }
    if (sorterParam?.columnKey) {
      sortBy = {
        column: sorterParam.columnKey as string,
        direction: sorterParam.order === 'ascend' ? 'ASC' : 'DESC',
      }
    } else {
      sortBy = { column: 'date', direction: 'DESC' }
    }
    const ttGetAllParams = TTGetAllParams.create({
      sortBy: [sortBy],
      page: pageParam,
      pageSize: pageSizeParam,
      userIds: filtersParam?.['user.abbr'],
      clientIds: filtersParam?.['client.abbr'],
      projectIds: filtersParam?.['project.abbr'],
      billableValues: filtersParam?.['billable'],
      isMe,
      dateAfter: dateFilter[0],
      dateBefore: dateFilter[1],
    })
    return ttGetAllParams
  }
}
