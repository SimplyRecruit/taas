export class EmailTemplateBase {
}

export class ResetPasswordEmailTemplate extends EmailTemplateBase {
    constructor(
        public name: string,
        public link: string
    ) {
        super()
    };

}
export class VerificationEmailTemplate extends EmailTemplateBase {
    constructor(
        name: string,
        link: string
    ) {
        super()
    };
}
