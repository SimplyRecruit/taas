import { Route } from '@/constants'
import { User } from 'models'

export const authRoutes: string[] = [Route.Login]

export async function checkAuthentication(
  path: string,
  token?: string
): Promise<{ user: User | null; routeToRedirect: 'login' | 'app' | null }> {
  try {
    if (!token) throw new Error('no token')
    const user = (await (
      await fetch(new URL('http://localhost:3000/api/user/me').href, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    ).json()) as User
    if (authRoutes.includes(path)) return { routeToRedirect: 'app', user }
    return { routeToRedirect: null, user }
  } catch (error) {
    console.log(error)
    if (!authRoutes.includes(path))
      return { routeToRedirect: 'login', user: null }
    return { routeToRedirect: null, user: null }
  }
}
