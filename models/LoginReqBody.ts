import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export default class {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}