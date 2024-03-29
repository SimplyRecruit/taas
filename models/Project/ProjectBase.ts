import { IsDateString, Length } from 'class-validator'
import Model from 'models/common/Model'

export default class ProjectBase extends Model {
  @Length(1, 255)
  abbr: string

  @Length(1, 255)
  name: string

  @IsDateString()
  startDate: Date
}
