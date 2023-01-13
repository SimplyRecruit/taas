import { MinLength } from "class-validator";

export default class {
    @MinLength(3)
    readonly name!: string;

    @MinLength(3)
    readonly surname!: string;
}
