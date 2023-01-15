import { IsEmail, IsString } from "class-validator";

export default class {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}