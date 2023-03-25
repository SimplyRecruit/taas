import { Route } from '@/constants'
import cookieKeys from '@/constants/cookie-keys'
import { User } from 'models'
import Cookies from 'universal-cookie'

export const authRoutes: string[] = [Route.Login, Route.ForgotPassword]

export const allWelcomeRoutes: string[] = [Route.ResetPassword]

export async function checkAuthentication(
  path: string,
  token?: string
): Promise<{ user: User | null; routeToRedirect: 'login' | 'app' | null }> {
  try {
    if (!token) throw new Error('no token')
    const user = (await (
      await fetch(
        new URL(
          (process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000') +
            '/api/user/me'
        ).href,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
    ).json()) as User
    if (authRoutes.includes(path)) return { routeToRedirect: 'app', user }
    return { routeToRedirect: null, user }
  } catch (error) {
    console.log(error)
    if (!authRoutes.includes(path) && !allWelcomeRoutes.includes(path))
      return { routeToRedirect: 'login', user: null }
    return { routeToRedirect: null, user: null }
  }
}

// Works with only components and pages
// does not work in middleware.page
export function getUserFromCookies(): User | null {
  return (new Cookies().get(cookieKeys.COOKIE_USER_OBJECT) as User) ?? null
}
