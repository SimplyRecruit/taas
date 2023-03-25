import { UserRole, UserStatus } from 'models'
import Model from 'models/common/Model'

export default class UserJwtPayload extends Model {
  id: string
  role: UserRole
  status: UserStatus
  active: boolean
  iat: number
  exp: number
}
