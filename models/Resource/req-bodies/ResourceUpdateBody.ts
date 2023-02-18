import { IsBoolean } from 'class-validator'
import ResourceBase from 'models/Resource/ResourceBase'

export default class ResourceUpdateBody extends ResourceBase {
  @IsBoolean()
  active: boolean
}
