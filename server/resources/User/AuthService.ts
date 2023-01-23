import { OrganizationEntity } from "@/server/resources/Organization/Entity";
import { UserEntity } from "@/server/resources/User/Entity";
import Jwt from "jsonwebtoken";
import { Action, BadRequestError, UnauthorizedError } from "routing-controllers";

export async function resolveUserToken(action: Action): Promise<Jwt.JwtPayload | null> {
    const authorization: string = action.request.headers['authorization'] ?? ''
    const token = authorization.startsWith("Bearer ") ? authorization.substring(7, authorization.length) : null
    if (token == null) return null
    try {
        const payload = Jwt.verify(token, process.env['JWT_SECRET']!)
        if (typeof payload === 'string') throw new BadRequestError()
        else return payload
    } catch (error) {
        throw new UnauthorizedError()
    }
}

export async function currentUserChecker(action: Action): Promise<UserEntity | false> {
    const payload = await resolveUserToken(action)
    if (payload == null) return false
    action.response.locals.user = await UserEntity.findOne({ relations: { organization: true }, where: { id: payload.id } }) ?? false
    return action.response.locals.user
}

export async function authorizationChecker(action: Action, roles: string[]): Promise<boolean> {
    const payload = await resolveUserToken(action)
    if (payload == null) return false
    if (!roles.length) return true
    else if (roles.some(role => role === payload.role)) return true
    else return false
}

export async function currentOrganizationChecker(action: Action): Promise<OrganizationEntity | false> {
    const user = await currentUserChecker(action)
    return user && user.organization
}