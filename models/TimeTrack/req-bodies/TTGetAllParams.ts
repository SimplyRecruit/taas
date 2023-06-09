import { IsArray, IsOptional } from 'class-validator'
import TableQueryParameters from 'models/common/TableQueryParameters'
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

  public static create({
    sortBy,
    pageSize,
    page,
    userIds,
    clientIds,
    projectIds,
  }: {
    sortBy?: { column: string; direction: 'ASC' | 'DESC' }[]
    pageSize: number
    page: number
    userIds?: string[]
    clientIds?: string[]
    projectIds?: string[]
  }) {
    const instance = TableQueryParameters.create({
      sortBy,
      pageSize,
      page,
    }) as TTGetAllParams
    instance.userIds = userIds
    instance.clientIds = clientIds
    instance.projectIds = projectIds
    return instance
  }
}
