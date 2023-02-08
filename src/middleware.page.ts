import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import checkAuthentication from '@/auth/utils/checkAuthentication'
import { Route } from '@/constants'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const authRedirect = await checkAuthentication(url.pathname, request.cookies)
  if (!authRedirect) return NextResponse.next()
  if (authRedirect == 'login') url.pathname = Route.Login
  else if (authRedirect == 'app') url.pathname = Route.DashBoard
  return NextResponse.redirect(url)
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
