import UserCookie from '@/auth/utils/UserCookie'
import { Route } from '@/constants'
import axios from 'axios'
import { User } from 'models'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import fetchAdapter from '@haverstack/axios-fetch-adapter'
import { NextRequest } from 'next/server'

export const authRoutes: string[] = [Route.Login]

export async function checkAuthentication(
  path: string,
  request: NextRequest
): Promise<'login' | 'app' | null> {
  try {
    const { token } = UserCookie.getUser(request)
    if (!token) throw new Error()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { data: user }: { data: User } = await axios.get(
      'http://localhost:3000/api/user/me',
      {
        headers: { authorization: `Bearer ${token}` },
        adapter: fetchAdapter,
      }
    )
    UserCookie.setUser(user, request)
    if (authRoutes.includes(path)) return 'app'
  } catch (error) {
    console.log(error)
    if (!authRoutes.includes(path)) return 'login'
  }
  return null
}

export function logout(request: NextRequest) {
  UserCookie.logout(request)
}
