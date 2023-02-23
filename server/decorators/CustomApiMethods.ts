/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Get as RCGet,
  Post as RCPost,
  Put as RCPut,
  Patch as RCPatch,
  Delete as RCDelete,
} from 'routing-controllers'
import type { HandlerOptions } from 'routing-controllers/types/decorator-options/HandlerOptions'

// eslint-disable-next-line @typescript-eslint/ban-types
type Class = Function

export function Get(
  promiseReturnType?: Class,
  route?: RegExp | string,
  options?: HandlerOptions
): Class {
  return apiMethod(RCGet, promiseReturnType, route, options)
}

export function Post(
  promiseReturnType?: Class,
  route?: RegExp | string,
  options?: HandlerOptions
): Class {
  return apiMethod(RCPost, promiseReturnType, route, options)
}

export function Put(
  promiseReturnType?: Class,
  route?: RegExp | string,
  options?: HandlerOptions
): Class {
  return apiMethod(RCPut, promiseReturnType, route, options)
}

export function Patch(
  promiseReturnType?: Class,
  route?: RegExp | string,
  options?: HandlerOptions
): Class {
  return apiMethod(RCPatch, promiseReturnType, route, options)
}

export function Delete(
  promiseReturnType?: Class,
  route?: RegExp | string,
  options?: HandlerOptions
): Class {
  return apiMethod(RCDelete, promiseReturnType, route, options)
}

function apiMethod(
  rcFunc: (route?: RegExp, options?: HandlerOptions) => Class,
  promiseReturnType?: Class,
  route?: RegExp | string,
  options?: HandlerOptions
): Class
function apiMethod(
  rcFunc: (route?: string, options?: HandlerOptions) => Class,
  promiseReturnType?: Class,
  route?: RegExp | string,
  options?: HandlerOptions
): Class
function apiMethod(
  rcFunc: (route: any, options?: HandlerOptions) => Class,
  promiseReturnType?: Class,
  route?: any,
  options?: HandlerOptions
): Class {
  return function (target: any, key: string) {
    rcFunc(route, { ...options, promiseReturnType } as HandlerOptions)(
      target,
      key
    )
  }
}
