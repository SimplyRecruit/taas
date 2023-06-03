import UserStatus from 'models/User/enums/UserStatus'
import ResourceBase from './ResourceBase'

export default class Resource extends ResourceBase {
  id: string
  email: string
  active: boolean
  status: UserStatus
}
