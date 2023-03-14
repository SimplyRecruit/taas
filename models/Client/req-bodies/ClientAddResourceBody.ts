import { IsBoolean, IsOptional, IsString } from 'class-validator'

export default class ClientAddResourceBody {
  @IsOptional()
  @IsString({ each: true })
  userIds?: string[]

  @IsBoolean()
  everyoneHasAccess: boolean
}
