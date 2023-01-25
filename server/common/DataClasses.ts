export class EmailTemplateBase {
}

export class ResetPasswordEmailTemplate extends EmailTemplateBase {
    constructor(
        name: string,
        link: string
    ) {
        super()
    };
}
export class VerificationPasswordEmailTemplate extends EmailTemplateBase {
    constructor(
        name: string,
        link: string
    ) {
        super()
    };
}
