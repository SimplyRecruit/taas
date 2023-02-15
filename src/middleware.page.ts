import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkAuthentication } from '@/auth/utils/AuthUtil'
import { Route } from '@/constants'
import cookieKeys from '@/constants/cookie-keys'
import { isLanguage } from 'models/Language'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(request.nextUrl.pathname)
  ) {
    return
  }

  if (request.nextUrl.locale === 'default') {
    const detectedLanguage =
      request.headers.get('Accept-Language')?.split(',')[0].substring(0, 2) ??
      ''
    const locale =
      request.cookies.get('NEXT_LOCALE')?.value ??
      (isLanguage(detectedLanguage) ? detectedLanguage : 'en')
    return NextResponse.redirect(
      new URL(
        `/${locale}${request.nextUrl.pathname}${request.nextUrl.search}`,
        request.url
      )
    )
  }

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
          JSON.stringify(user),
          { path: '/' }
        )
      }
      return response
    }
    case 'app': {
      url.pathname = Route.DashBoard
      const response = NextResponse.redirect(url)
      response.cookies.set(
        cookieKeys.COOKIE_USER_OBJECT,
        JSON.stringify(user),
        { path: '/' }
      )
      return response
    }
    case 'login': {
      url.pathname = Route.Login
      return NextResponse.redirect(url)
    }
  }
}
