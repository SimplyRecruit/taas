/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EmailTemplate } from '~/common/DataClasses'
import { smtp } from '~/main'
import Fs from 'fs/promises'
import { getMetadataArgsStorage } from 'routing-controllers'
import { join } from 'path'
import Handlebars from 'handlebars'

export async function sendEmail(to: string, emailTemplate: EmailTemplate.Base) {
  const message = {
    to,
    from: 'no-reply@bowform.com',
    templateId: emailTemplate.id,
    version: 'en',
    dynamicTemplateData: emailTemplate.parameters,
  }
  await smtp.send(message)
}

export async function generateApiCalls() {
  type methodType = 'get' | 'post' | 'patch' | 'put' | 'delete'
  const primitiveTypes = ['String', 'Number', 'BigInt', 'Boolean', 'Symbol']
  const apiMethods: {
    [key: string]: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: { route: string | RegExp; method: methodType; params: any }
    }
  } = {}
  const storage = getMetadataArgsStorage()
  const imports = new Set<string>()
  for (const controller of storage.controllers) {
    const controllerRegexpArray =
      controller.target.name.match(/^(\S+)(Controller)$/)
    if (controllerRegexpArray == null) throw new Error('Invalid Controller')
    const controllerName = firstCharToLower(controllerRegexpArray[1])
    apiMethods[controllerName] = {}
    const actions = storage.filterActionsWithTarget(controller.target)
    for (const action of actions) {
      const params = storage.filterParamsWithTargetAndMethod(
        controller.target,
        action.method
      )
      const paramsToBeIncluded = params.filter(p =>
        ['body', 'bodyParam', 'query', 'queries', 'param', 'params'].includes(
          p.type
        )
      )
      const finalParams: {
        body: { [key: string]: { type: string; import: boolean } }[]
        bodyClass: null | string
        queries: string[]
        queriesClass: null | string
        params: string[]
        paramsClass: null | string
        hasBody: boolean
        hasParams: boolean
        hasQueries: boolean
      } = {
        body: [],
        bodyClass: null,
        params: [],
        paramsClass: null,
        queries: [],
        queriesClass: null,
        hasBody: false,
        hasParams: false,
        hasQueries: false,
      }
      for (const param of paramsToBeIncluded) {
        let explicitType: string | undefined = param.explicitType?.name
        switch (param.type) {
          case 'body-param':
            // TODO: Find what is wrong with body-param and implement
            break
          case 'body':
            finalParams.hasBody = true
            if (!primitiveTypes.includes(explicitType!))
              imports.add(explicitType!)
            else explicitType = explicitType!.toLowerCase()
            finalParams.bodyClass = explicitType!
            break
          case 'param':
            finalParams.hasParams = true
            finalParams.params.push(param.name!)
            break
          case 'params':
            finalParams.hasParams = true
            if (!primitiveTypes.includes(explicitType!))
              imports.add(explicitType!)
            else explicitType = explicitType!.toLowerCase()
            finalParams.paramsClass = explicitType!
            break
          case 'query':
            finalParams.hasQueries = true
            finalParams.queries.push(param.name!)
            break
          case 'queries':
            finalParams.hasQueries = true
            if (!primitiveTypes.includes(explicitType!))
              imports.add(explicitType!)
            else explicitType = explicitType!.toLowerCase()
            finalParams.queriesClass = explicitType!
            break
          default:
            break
        }
      }
      apiMethods[controllerName][action.method] = {
        route: (controller.route ?? '/') + (action.route ?? ''),
        method: <methodType>action.type,
        params: finalParams,
      }
    }
  }
  const templateFile = await Fs.readFile(
    join(__dirname, './api-generator.hbs'),
    { encoding: 'utf8' }
  )
  Handlebars.registerHelper('stringify', context => JSON.stringify(context))
  const template = Handlebars.compile(templateFile)
  const result = template({ controllers: apiMethods, imports })
  await Fs.writeFile(join(__dirname, '../../src/services/apis.ts'), result, {
    encoding: 'utf8',
  })
}

function firstCharToLower(string: string) {
  return string.charAt(0).toLowerCase() + string.slice(1)
}
