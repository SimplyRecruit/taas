import { IsBoolean, IsDateString, Length } from 'class-validator'
import Model from 'models/Model'

export default class Project extends Model {
  @Length(1, 10)
  id: string

  @Length(1, 255)
  name: string

  @Length(1, 255)
  client: string

  @IsDateString()
  startDate: Date

  @IsBoolean()
  active: boolean
}
