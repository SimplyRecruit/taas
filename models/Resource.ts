import { IsDateString, IsInt, IsPositive, Length, Max } from "class-validator";
import Model from "models/Model";

export default class extends Model {
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