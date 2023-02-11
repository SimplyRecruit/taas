/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body as RCBody,
  QueryParams as RCQueryParams,
  BodyParam as RCBodyParam,
  BodyOptions,
  ParamOptions,
} from 'routing-controllers'

// eslint-disable-next-line @typescript-eslint/ban-types
type Class = Function

export function Body(options?: BodyOptions | undefined): Class {
  return function (target: any, key: string, index: number) {
    const type = Reflect.getOwnMetadata('design:paramtypes', target, key)[index]
    RCBody({ ...options, type })(target, key, index)
  }
}

export function QueryParams(options?: ParamOptions | undefined): Class {
  return function (target: any, key: string, index: number) {
    const type = Reflect.getOwnMetadata('design:paramtypes', target, key)[index]
    RCQueryParams({ ...options, type })(target, key, index)
  }
}

export function BodyParam(
  name: string,
  options?: ParamOptions | undefined
): Class {
  throw new Error('BodyParam Not Implemented')
  return function (target: any, key: string, index: number) {
    const type = Reflect.getOwnMetadata('design:paramtypes', target, key)[index]
    RCBodyParam(name, { ...options, type })(target, key, index)
  }
}
