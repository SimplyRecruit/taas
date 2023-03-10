import { IsBoolean, IsDateString } from 'class-validator'
import Model from 'models/Model'

export default class ReportReqBody extends Model {
  @IsDateString()
  from: Date

  @IsDateString()
  to: Date

  @IsBoolean()
  billable?: boolean
}
