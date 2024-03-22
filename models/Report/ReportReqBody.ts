import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator'
import Model from 'models/common/Model'

export default class ReportReqBody extends Model {
  @IsDateString()
  dateAfter: Date

  @IsDateString()
  dateBefore: Date

  @IsOptional()
  @IsBoolean()
  billable?: boolean

  @IsOptional()
  @IsString({ each: true })
  userIds?: string[]

  @IsOptional()
  @IsString({ each: true })
  clientIds?: string[]

  @IsOptional()
  @IsString({ each: true })
  projectIds?: string[]

  @IsOptional()
  @IsString({ each: true })
  partnerNames?: string[]
}
