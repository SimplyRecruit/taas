import { smtp } from "~/main"
import { EmailTemplate } from "~/common/DataClasses"

export async function sendEmail(to: string, emailTemplate: EmailTemplate.Base) {
    console.log(emailTemplate)
    const message = {
        to,
        from: 'no-reply@bowform.com',
        templateId: emailTemplate.id,
        version: 'en',
        dynamicTemplateData: emailTemplate.parameters
    }
    await smtp.send(message)
}