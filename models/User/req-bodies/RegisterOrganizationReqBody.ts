import { IsEmail, MaxLength, MinLength } from 'class-validator'
import Model from 'models/common/Model'

export default class RegisterOrganizationReqBody extends Model {
  @IsEmail()
  email: string

  @MinLength(2)
  @MaxLength(100)
  organizationName: string

  @MinLength(2)
  @MaxLength(100)
  adminName: string

  @MinLength(1)
  @MaxLength(100)
  adminAbbr: string
}
