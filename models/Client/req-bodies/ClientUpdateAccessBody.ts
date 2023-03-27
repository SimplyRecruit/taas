import { IsBoolean, IsOptional, IsString } from 'class-validator'
import Model from 'models/common/Model'

export default class ClientUpdateAccessBody extends Model {
  @IsOptional()
  @IsString({ each: true })
  userIds?: string[]

  @IsBoolean()
  everyoneHasAccess: boolean
}
