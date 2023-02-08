import { COOKIE_BASE } from '@/constants/globals'
import { User } from 'models'
import { NextRequest } from 'next/server'
import Cookies from 'universal-cookie'

const UserCookie = {
  setUser(user: User, request?: NextRequest) {
    const cookiesLib = new Cookies()
    if (!request) {
      cookiesLib.set(COOKIE_BASE + 'userPayload', JSON.stringify(user))
    } else {
      request.cookies.set(COOKIE_BASE + 'userPayload', JSON.stringify(user))
    }
  },
  setUserToken(token: string, request?: NextRequest) {
    const cookiesLib = new Cookies()
    if (!request) {
      cookiesLib.set(COOKIE_BASE + 'userToken', token)
    } else {
      request.cookies.set(COOKIE_BASE + 'userToken', token)
    }
  },
  getUser(request?: NextRequest): {
    user: User | undefined
    token: string | undefined
  } {
    if (!request) {
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
      const token = request.cookies.get(COOKIE_BASE + 'userToken')?.value
      const userString = request.cookies.get(COOKIE_BASE + 'userPayload')
      if (!userString) return { token, user: undefined }
      const user: User = User.create(JSON.parse(userString.value))
      return { token, user }
    }
  },
  logout(request?: NextRequest) {
    if (!request) {
      const cookiesLib = new Cookies()
      cookiesLib.remove(COOKIE_BASE + 'userToken')
      cookiesLib.remove(COOKIE_BASE + 'userPayload')
    } else {
      request.cookies.delete(COOKIE_BASE + 'userToken')
      request.cookies.delete(COOKIE_BASE + 'userPayload')
    }
  },
}

export default UserCookie
