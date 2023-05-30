import { IsArray, IsOptional } from 'class-validator'
import TableQueryParameters from 'models/common/TableQueryParameters'
export default class TTGetAllParams extends TableQueryParameters {
  @IsArray()
  @IsOptional()
  userIds?: string[]

  public static create({
    sortBy,
    pageSize,
    page,
    userIds,
  }: {
    sortBy?: { column: string; direction: 'ASC' | 'DESC' }[]
    pageSize: number
    page: number
    userIds?: string[]
  }) {
    const instance = TableQueryParameters.create({
      sortBy,
      pageSize,
      page,
    }) as TTGetAllParams
    instance.userIds = userIds
    return instance
  }
}
