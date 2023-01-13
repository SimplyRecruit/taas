import { IsEmail, IsStrongPassword, MaxLength, MinLength, IsDefined, IsOptional } from "class-validator";

export default class {
    @IsEmail()
    email: string;

    @MinLength(8)
    @MaxLength(32)
    // TODO: Change decorator with strong password
    password: string;

    @IsOptional()
    @MinLength(2)
    @MaxLength(100)
    name?: string
}