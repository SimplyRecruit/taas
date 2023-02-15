import {
  IsDateString,
  IsEnum,
  IsInt,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
} from 'class-validator'
import { UserRole } from 'models'
import moment from 'dayjs'
import Model from 'models/Model'

export default class ResourceBase extends Model {
  @MinLength(2)
  @MaxLength(100)
  name: string

  @IsDateString()
  startDate: moment.Dayjs

  @IsInt()
  @Min(0)
  @Max(32767)
  hourlyRate: number

  @IsEnum(UserRole)
  @NotEquals(UserRole.SU)
  role: UserRole
}
