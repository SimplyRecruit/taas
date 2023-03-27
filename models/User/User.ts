import { UserRole } from 'models'
import Model from 'models/common/Model'
export default class User extends Model {
  name: string
  id: string
  role: UserRole
  email: string
  organization: { id: string; name: string }
}
