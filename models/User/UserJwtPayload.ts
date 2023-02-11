import Model from 'models/Model'
import UserStatus from 'models/User/UserStatus'
import UserRole from './UserRole'

export default class UserJwtPayload extends Model {
  id: string
  role: UserRole
  status: UserStatus
  active: boolean
  iat: number
  exp: number
}
