import { UserRole } from 'models'
import Model from 'models/Model'
export default class User extends Model {
  name: string
  id: string
  role: UserRole
  email: string
  organization: { id: string; name: string }
}
