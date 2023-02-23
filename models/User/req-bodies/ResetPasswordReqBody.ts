import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import Model from 'models/Model'
export default class ResetPasswordReqBody extends Model {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
