import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator'
import Model from 'models/Model'

export default class ReportReqBody extends Model {
  @IsDateString()
  from: Date

  @IsDateString()
  to: Date

  @IsOptional()
  @IsBoolean()
  billable?: boolean

  @IsOptional()
  @IsString({ each: true })
  resourceIds?: string[]

  @IsOptional()
  @IsString({ each: true })
  clientIds?: string[]

  @IsOptional()
  @IsString({ each: true })
  projectIds?: string[]
}
