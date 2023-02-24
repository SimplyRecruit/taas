import { IsOptional, IsString } from 'class-validator'
import ClientBase from 'models/Client/ClientBase'

export default class ClientUpdateBody extends ClientBase {
  @IsOptional()
  @IsString({ each: true })
  resourceIds?: string[]
}
