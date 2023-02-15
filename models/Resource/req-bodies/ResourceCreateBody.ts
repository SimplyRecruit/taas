import { IsEmail } from 'class-validator'

import ResourceBase from '../ResourceBase'

export default class ResourceCreateBody extends ResourceBase {
  @IsEmail()
  email: string
}
