import { smtp } from "@/server/main"
import { EMAIL_TEMPLATE_IDs } from "@/server/common/Config"
import { EmailTemplateBase } from "@/server/common/DataClasses"
import Language from "@/models/Language"


export async function sendEmail(to: string, language: Language, emailTemplate: EmailTemplateBase) {
    console.log(emailTemplate)
    const message = {
        to,
        from: 'no-reply@bowform.com',
        templateId: EMAIL_TEMPLATE_IDs[emailTemplate.constructor.name][language],
        version: 'en',
        dynamicTemplateData: { ...emailTemplate }
    }
    await smtp.send(message)
}