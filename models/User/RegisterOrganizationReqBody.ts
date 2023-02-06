import { IsEmail, MaxLength, MinLength } from 'class-validator'
import Model from 'models/Model'

export default class RegisterOrganizationReqBody extends Model {
  @IsEmail()
  email: string

  @MinLength(2)
  @MaxLength(100)
  organizationName: string

  @MinLength(2)
  @MaxLength(100)
  name: string
}
