import { Type } from 'class-transformer'
import 'reflect-metadata'
import { IsBoolean, IsDate, IsPositive, Length } from 'class-validator'
import Model from 'models/Model'

export default class TTBase extends Model {
  @Length(1, 255)
  description: string

  @IsDate()
  @Type(() => Date)
  date: Date

  @IsPositive()
  hour: number

  @IsBoolean()
  billable: boolean

  @Length(1, 255)
  ticketNo: string
}
