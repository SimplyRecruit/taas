import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkAuthentication, logout } from '@/auth/utils/AuthUtil'
import { Route } from '@/constants'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  if (url.pathname === Route.Logout) {
    logout(request)
    url.pathname = Route.Login
    return NextResponse.redirect(url)
  }
  const authRedirect = await checkAuthentication(url.pathname, request)
  if (!authRedirect) return NextResponse.next()
  if (authRedirect == 'login') url.pathname = Route.Login
  else if (authRedirect == 'app') url.pathname = Route.DashBoard
  return NextResponse.redirect(url)
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
