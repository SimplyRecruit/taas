import { Length, IsDate, IsPositive, Max, IsInt, IsDateString } from "class-validator";

export default class {
    @Length(1, 10)
    id: string

    @Length(1, 255)
    name: string

    @IsDateString()
    startDate: Date

    @IsPositive()
    @Max(32767)
    @IsInt()
    hourlyRate: number
}