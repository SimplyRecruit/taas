import ClientBase from 'models/Client/ClientBase'
import Resource from 'models/Resource/Resource'

export default class Client extends ClientBase {
  id: string
  resources?: Resource[]
  active: boolean
  everyoneHasAccess?: boolean
}
