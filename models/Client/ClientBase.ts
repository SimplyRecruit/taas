import { IsBoolean, IsDateString, IsEnum, Length } from 'class-validator'
import Model from 'models/Model'
import ClientContractType from './enums/ClientContractType'

export default class ClientBase extends Model {
  @Length(1, 10)
  id: string

  @Length(1, 255)
  name: string

  @IsDateString()
  startDate: Date

  @IsDateString()
  contractDate?: Date

  @IsEnum(ClientContractType)
  contractType: ClientContractType

  @Length(0, 255)
  partnerName?: string

  @IsBoolean()
  active: boolean

  @IsBoolean()
  everyoneHasAccess: boolean
}
