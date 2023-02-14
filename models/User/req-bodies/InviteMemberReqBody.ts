import {
  IsEmail,
  IsEnum,
  IsInt,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
} from 'class-validator'
import { UserRole } from 'models'
import Model from 'models/Model'

export default class InviteMemberReqBody extends Model {
  @MinLength(2)
  @MaxLength(100)
  name: string

  @IsEmail()
  email: string

  @IsInt()
  @Min(0)
  @Max(32767)
  hourlyRate: number

  @IsEnum(UserRole)
  @NotEquals(UserRole.SU)
  role: UserRole
}
