import { IsEmail, MaxLength, MinLength } from "class-validator";

export default class {
    @IsEmail()
    email: string;

    @MinLength(2)
    @MaxLength(100)
    organizationName: string

    @MinLength(2)
    @MaxLength(100)
    name: string
}