import {
  IsEmail,
  IsEnum,
  IsInt,
  IsPositive,
  Max,
  MaxLength,
  MinLength,
  NotEquals,
} from 'class-validator'
import Model from 'models/Model'
import UserRole from 'models/User/UserRole'

export default class InviteMemberReqBody extends Model {
  @MinLength(2)
  @MaxLength(100)
  name: string

  @IsEmail()
  email: string

  @IsPositive()
  @Max(32767)
  @IsInt()
  hourlyRate: number

  @IsEnum(UserRole)
  @NotEquals(UserRole.SU)
  role: UserRole
}
