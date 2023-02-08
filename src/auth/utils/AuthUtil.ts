import { Route } from '@/constants'
import axios from 'axios'
import { User } from 'models'
import fetchAdapter from '@haverstack/axios-fetch-adapter'

export const authRoutes: string[] = [Route.Login]

export async function checkAuthentication(
  path: string,
  token?: string
): Promise<{ user: User | null; routeToRedirect: 'login' | 'app' | null }> {
  try {
    if (!token) throw new Error('no token')
    const { data: user }: { data: User } = await axios.get(
      'http://localhost:3000/api/user/me',
      {
        headers: { authorization: `Bearer ${token}` },
        adapter: fetchAdapter,
      }
    )
    if (authRoutes.includes(path)) return { routeToRedirect: 'app', user }
    return { routeToRedirect: null, user }
  } catch (error) {
    console.log(error)
    if (!authRoutes.includes(path))
      return { routeToRedirect: 'login', user: null }
    return { routeToRedirect: null, user: null }
  }
}
