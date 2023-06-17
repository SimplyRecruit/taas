import TTFilterType from '@/pages/time-tracker/types/TTFilterType'
import { SorterResult } from 'antd/es/table/interface'
import { IsArray, IsBoolean, IsOptional } from 'class-validator'
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
  @IsBoolean()
  isMe: boolean

  public static create({
    sortBy,
    pageSize,
    page,
    userIds,
    clientIds,
    projectIds,
    isMe,
  }: {
    sortBy?: { column: string; direction: 'ASC' | 'DESC' }[]
    pageSize: number
    page: number
    userIds?: string[]
    clientIds?: string[]
    projectIds?: string[]
    isMe: boolean
  }) {
    const instance = TableQueryParameters.create({
      sortBy,
      pageSize,
      page,
    }) as TTGetAllParams
    instance.userIds = userIds
    instance.clientIds = clientIds
    instance.projectIds = projectIds
    instance.isMe = isMe
    return instance
  }

  public static createFromParams(
    pageParam: number,
    pageSizeParam: number,
    sorterParam: SorterResult<TT> | undefined,
    filtersParam: any,
    isMe: boolean
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
      userIds: filtersParam?.[TTFilterType.USER],
      clientIds: filtersParam?.[TTFilterType.CLIENT],
      projectIds: filtersParam?.[TTFilterType.PROJECT],
      isMe,
    })
    return ttGetAllParams
  }
}
