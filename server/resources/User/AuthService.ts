import Bcrypt from 'bcrypt'
import crypto from 'crypto'
import { Request } from 'express'
import Jwt from 'jsonwebtoken'
import { UserJwtPayload, UserStatus } from 'models'
import { Action, BadRequestError, UnauthorizedError } from 'routing-controllers'
import { EntityManager } from 'typeorm/entity-manager/EntityManager'
import OrganizationEntity from '~/resources/Organization/Entity'
import SessionTokenEntity from '~/resources/SessionToken/Entity'
import UserEntity from '~/resources/User/Entity'

export async function resolveUserToken(
  action: Action
): Promise<UserJwtPayload | null> {
  const authorization: string = action.request.headers['authorization'] ?? ''
  const token = authorization.startsWith('Bearer ')
    ? authorization.substring(7, authorization.length)
    : null
  if (token == null) return null
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const payload = Jwt.verify(token, process.env['JWT_SECRET']!)
    if (typeof payload === 'string') throw new BadRequestError()
    else return payload as UserJwtPayload
  } catch (error) {
    throw new UnauthorizedError()
  }
}

export async function currentUserChecker(
  action: Action
): Promise<UserEntity | false> {
  const payload = await resolveUserToken(action)
  if (payload == null) return false
  action.response.locals.user =
    (await UserEntity.findOne({
      relations: { organization: true },
      where: { id: payload.id },
    })) ?? false
  return action.response.locals.user
}

export async function authorizationChecker(
  action: Action,
  roles: string[]
): Promise<boolean> {
  const payload = await resolveUserToken(action)
  if (payload == null) return false
  if (!payload.active || payload.status !== UserStatus.CONFIRMED) return false
  if (!roles.length) return true
  else if (roles.some(role => role === payload.role)) return true
  else return false
}

export async function currentOrganizationChecker(
  action: Action
): Promise<OrganizationEntity | false> {
  const user = await currentUserChecker(action)
  return user && user.organization
}

export function createResetPasswordLink(
  req: Request,
  token: string,
  email: string
) {
  return (
    req.protocol +
    '://' +
    req.headers.host +
    `/auth/reset-password?token=` +
    token +
    '&email=' +
    encodeURIComponent(email)
  )
}

export async function createSessionToken(user: UserEntity, em?: EntityManager) {
  const token = crypto.randomBytes(64).toString('hex')
  const tokenHash = Bcrypt.hashSync(token, 8)
  const expiration = new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours
  em
    ? await em.save(SessionTokenEntity, { tokenHash, user, expiration })
    : await SessionTokenEntity.save({ tokenHash, user, expiration })

  return token
}
