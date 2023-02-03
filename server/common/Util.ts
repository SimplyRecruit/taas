import { EmailTemplate } from "~/common/DataClasses"
import { smtp } from "~/main"
import Fs from "fs/promises"
import { getMetadataArgsStorage } from "routing-controllers"
import { join } from "path"
import Handlebars from "handlebars"

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

export async function generateApiCalls() {
    type methodType = 'get' | 'post' | 'patch' | 'put' | 'delete'
    const apiMethods: { [key: string]: { [key: string]: { route: string | RegExp, method: methodType, params: any } } } = {};
    const storage = getMetadataArgsStorage()
    for (const controller of storage.controllers) {
        const controllerRegexpArray = controller.target.name.match(/^(\S+)(Controller)$/)
        if (controllerRegexpArray == null) throw new Error("Invalid Controller")
        const controllerName = controllerRegexpArray[1].charAt(0).toLowerCase() + controllerRegexpArray[1].slice(1)
        apiMethods[controllerName] = {};
        const actions = storage.filterActionsWithTarget(controller.target)
        for (const action of actions) {
            const params = storage.filterParamsWithTargetAndMethod(controller.target, action.method)
            const paramsToBeIncluded = params.filter(p => ['body', 'bodyParam', 'query', 'queries', 'param', 'params'].includes(p.type))
            const finalParams: {
                body: string[],
                queries: string[],
                params: string[],
                hasBody: boolean,
                hasQueries: boolean,
                hasParams: boolean,
                bodyNoProps: boolean,
                paramsNoProps: boolean,
                queriesNoProps: boolean,
            } = { body: [], params: [], queries: [], hasBody: false, hasParams: false, hasQueries: false, bodyNoProps: false, paramsNoProps: false, queriesNoProps: false }
            for (const param of paramsToBeIncluded) {
                switch (param.type) {
                    case "body-param":
                        finalParams.body.push(param.name!)
                        finalParams.hasBody = true
                        break;
                    case "body":
                        finalParams.hasBody = true
                        finalParams.bodyNoProps = true
                        break;
                    case "param":
                        finalParams.params.push(param.name!)
                        finalParams.hasParams = true
                        break;
                    case "params":
                        finalParams.hasParams = true
                        finalParams.paramsNoProps = true
                        break;
                    case "query":
                        finalParams.queries.push(param.name!)
                        finalParams.hasQueries = true
                        break;
                    case "queries":
                        finalParams.hasQueries = true
                        finalParams.queriesNoProps = true
                        break;
                    default:
                        break;
                }
            }
            apiMethods[controllerName][action.method] = { route: (controller.route ?? "/") + (action.route ?? ""), method: <methodType>action.type, params: finalParams }
        }
    }
    const templateFile = await Fs.readFile(join(__dirname, "./api-generator.hbs"), { encoding: "utf8" })
    Handlebars.registerHelper('stringify', (context) => JSON.stringify(context))
    const template = Handlebars.compile(templateFile)
    const result = template({ controllers: apiMethods })
    await Fs.writeFile(join(__dirname, "../../src/services/apis.ts"), result, { encoding: "utf8" })
}