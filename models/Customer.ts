import { IsBoolean, IsDateString, IsEnum, Length } from "class-validator";
import Model from "models/Model";
import CustomerContractType from "./CustomerContractType";

export default class extends Model {
    @Length(1, 10)
    id: string

    @Length(1, 255)
    name: string

    @IsDateString()
    startDate: Date

    @IsDateString()
    contractDate: Date

    @IsEnum(CustomerContractType)
    contractType: CustomerContractType

    @Length(1, 255)
    partnerName: string

    @IsBoolean()
    active: boolean
}