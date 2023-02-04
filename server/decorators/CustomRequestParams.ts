import { Body as RCBody, QueryParams as RCQueryParams, BodyParam as RCBodyParam, BodyOptions, ParamOptions } from "routing-controllers"

export function Body(options?: BodyOptions | undefined): Function {
    return function (target: any, key: string, index: number) {
        const type = Reflect.getOwnMetadata("design:paramtypes", target, key)[index]
        RCBody({ ...options, type })(target, key)
    }
}

export function QueryParams(options?: ParamOptions | undefined): Function {
    return function (target: any, key: string, index: number) {
        const type = Reflect.getOwnMetadata("design:paramtypes", target, key)[index]
        RCQueryParams({ ...options, type })(target, key)
    }
}

export function BodyParam(name: string, options?: ParamOptions | undefined): Function {
    throw new Error("BodyParam Not Implemented")
    return function (target: any, key: string, index: number) {
        const type = Reflect.getOwnMetadata("design:paramtypes", target, key)[index]
        RCBodyParam(name, { ...options, type })(target, key)
    }
}