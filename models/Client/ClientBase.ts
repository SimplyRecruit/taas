import { IsDateString, IsEnum, IsOptional, Length } from 'class-validator'
import Model from 'models/Model'
import ClientContractType from './enums/ClientContractType'

export default class ClientBase extends Model {
  @Length(1, 255)
  name: string

  @Length(1, 255)
  abbr: string

  @IsDateString()
  startDate: Date

  @IsOptional()
  @IsDateString()
  contractDate: Date | null

  @IsEnum(ClientContractType)
  contractType: ClientContractType

  @Length(0, 255)
  partnerName?: string
}
