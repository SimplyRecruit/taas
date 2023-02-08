import { COOKIE_BASE } from '@/constants/globals'
import { User } from 'models'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import Cookies, { Cookie } from 'universal-cookie'

const UserCookie = {
  setUser(user: User, cookies?: RequestCookies | Cookies) {
    cookies ??= new Cookies()
    cookies.set(COOKIE_BASE + 'userPayload', JSON.stringify(user))
  },
  setUserToken(token: string, cookies?: RequestCookies | Cookies) {
    cookies ??= new Cookies()
    cookies.set(COOKIE_BASE + 'userToken', token)
  },
  getUser(cookies?: RequestCookies): {
    user: User | undefined
    token: string | undefined
  } {
    if (!cookies) {
      const cookiesLib = new Cookies()
      const token = cookiesLib.get(COOKIE_BASE + 'userToken', {
        doNotParse: true,
      })
      const userString = cookiesLib.get(COOKIE_BASE + 'userPayload', {
        doNotParse: true,
      })
      if (!userString) return { token, user: undefined }
      else return { token, user: JSON.parse(userString) as User }
    } else {
      const token = cookies.get(COOKIE_BASE + 'userToken')?.value
      const userString = cookies.get(COOKIE_BASE + 'userPayload')
      if (!userString) return { token, user: undefined }
      const user: User = User.create(JSON.parse(userString.value))
      return { token, user }
    }
  },
}

export default UserCookie
