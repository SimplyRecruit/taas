import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import Model from 'models/common/Model'
export default class LoginReqBody extends Model {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
