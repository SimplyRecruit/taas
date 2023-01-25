export class EmailTemplateBase {
    params: any
}

export class ResetPasswordEmailTemplate extends EmailTemplateBase {
    constructor(params: {
        name: string
        link: string
    }) {
        super()
        this.params = params
    };
}
