import Jwt from "jsonwebtoken";
import { Action, BadRequestError, UnauthorizedError } from "routing-controllers";

const tokenRegex: RegExp = /^Bearer ((?:\.?(?:[A-Za-z0-9-_]+)){3})$/gm

export async function checkCurrentUser(action: Action) {
    const token = tokenRegex.exec(action.request.headers['authorization'])?.[1]
    if (token == null) return null
    try {
        const payload = Jwt.verify(token, process.env['JWT_SECRET']!)
        if (typeof payload === 'string') throw new BadRequestError()
        else return payload
    } catch (error) {
        throw new UnauthorizedError()
    }
}

export async function checkIfAuthorized(action: Action, roles: string[]) {
    const payload = await checkCurrentUser(action)
    if (payload == null) return false
    if (!roles.length) return true
    else if (roles.some(role => role === payload.role)) return true
    else return false
}