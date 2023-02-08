import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkAuthentication } from '@/auth/utils/AuthUtil'
import { Route } from '@/constants'
import cookieKeys from '@/constants/cookie-keys'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  if (url.pathname === Route.Logout) {
    url.pathname = Route.Login
    const response = NextResponse.redirect(url)
    response.cookies
      .delete(cookieKeys.COOKIE_USER_TOKEN)
      .delete(cookieKeys.COOKIE_USER_OBJECT)
    return response
  }
  const token = request.cookies.get(cookieKeys.COOKIE_USER_TOKEN)?.value
  const { routeToRedirect, user } = await checkAuthentication(
    url.pathname,
    token
  )
  switch (routeToRedirect) {
    case null: {
      const response = NextResponse.next()
      if (user) {
        response.cookies.set(
          cookieKeys.COOKIE_USER_OBJECT,
          JSON.stringify(user)
        )
      }
      return response
    }
    case 'app': {
      url.pathname = Route.DashBoard
      const response = NextResponse.redirect(url)
      response.cookies.set(cookieKeys.COOKIE_USER_OBJECT, JSON.stringify(user))
      return response
    }
    case 'login': {
      url.pathname = Route.Login
      return NextResponse.redirect(url)
    }
  }
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
