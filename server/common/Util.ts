import { smtp } from "@/server/main"
import { EmailTemplateBase } from "@/server/common/DataClasses"
import { EMAIL_TEMPLATE_IDs } from "@/server/common/Config"


export async function sendEmail(to: string, language: string, emailTemplate: EmailTemplateBase) {
    const message = {
        to,
        from: 'no-reply@bowform.com',
        templateId: EMAIL_TEMPLATE_IDs[emailTemplate.constructor.name][language],
        version: 'en',
        dynamicTemplateData: emailTemplate.params

    }
    await smtp.send(message)
}