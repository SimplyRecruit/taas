import { IsBoolean, IsOptional, IsString } from 'class-validator'

export default class ClientAddResourceBody {
  @IsOptional()
  @IsString({ each: true })
  resourceIds?: string[]

  @IsBoolean()
  everyoneHasAccess: boolean
}
