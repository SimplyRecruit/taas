import 'reflect-metadata'
import { IsBoolean, IsPositive, Length } from 'class-validator'
import Model from 'models/Model'

export default class TTBase extends Model {
  @Length(1, 255)
  description: string

  @IsPositive()
  hour: number

  @IsBoolean()
  billable: boolean

  @Length(0, 255)
  ticketNo: string
}
