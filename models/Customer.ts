import { IsBoolean, IsDateString, IsEnum, Length } from "class-validator";
import CustomerContractType from "./CustomerContractType";

export default class {
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