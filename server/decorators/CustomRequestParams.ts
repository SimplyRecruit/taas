/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body as RCBody,
  QueryParams as RCQueryParams,
  BodyParam as RCBodyParam,
  BodyOptions as RCBodyOptions,
  ParamOptions,
} from 'routing-controllers'

// eslint-disable-next-line @typescript-eslint/ban-types
type Class = Function
interface BodyOptions extends RCBodyOptions {
  patch?: boolean
}

export function Body(options?: BodyOptions): Class {
  return function (target: any, key: string, index: number) {
    if (options?.patch && Object.keys(target).length === 0) {
      if (typeof options.validate != 'object') {
        options.validate = { skipUndefinedProperties: true }
      } else
        options.validate = {
          ...options.validate,
          skipUndefinedProperties: true,
        }
    }
    const type = Reflect.getOwnMetadata('design:paramtypes', target, key)[index]
    RCBody({ ...options, type })(target, key, index)
  }
}

export function QueryParams(options?: ParamOptions): Class {
  return function (target: any, key: string, index: number) {
    const type = Reflect.getOwnMetadata('design:paramtypes', target, key)[index]
    RCQueryParams({ ...options, type })(target, key, index)
  }
}

export function BodyParam(name: string, options?: ParamOptions): Class {
  throw new Error('BodyParam Not Implemented')
  return function (target: any, key: string, index: number) {
    const type = Reflect.getOwnMetadata('design:paramtypes', target, key)[index]
    RCBodyParam(name, { ...options, type })(target, key, index)
  }
}
