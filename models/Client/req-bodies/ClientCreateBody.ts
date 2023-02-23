import { IsOptional, IsString } from 'class-validator'
import ClientBase from 'models/Client/ClientBase'

export default class ClientCreateBody extends ClientBase {
  @IsOptional()
  @IsString({ each: true })
  resourceIds?: string[]
}
