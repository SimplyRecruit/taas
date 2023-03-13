import { IsBoolean } from 'class-validator'
import ClientBase from 'models/Client/ClientBase'

export default class ClientUpdateBody extends ClientBase {
  @IsBoolean()
  active: boolean
}
