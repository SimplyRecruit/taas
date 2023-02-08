import Model from 'models/Model'
import UserRole from 'models/User/UserRole'

export default class UserJwtPayload extends Model {
  name: string
  id: string
  role: UserRole
  email: string
  organization: { id: string; name: string }
}
