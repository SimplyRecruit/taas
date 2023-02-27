import { IsBoolean, IsDateString, IsPositive, Length } from 'class-validator'
import Model from 'models/Model'

export default class TTBase extends Model {
  @Length(1, 255)
  description: string

  @IsDateString()
  date: Date

  @IsPositive()
  hour: number

  @IsBoolean()
  billable: boolean

  @Length(1, 255)
  ticketNo: string
}
