import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/session'

export default async function proxy(request: NextRequest) {
  const session = await getSession()
  const { pathname } = request.nextUrl

  const protectedRoutes = ['/auth/*']
  const publicRoutes = ['/login', '/register', '/about', '/']

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // If user has no session and tries to access protected route
  if (!session.token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If user has session and tries to access login/register
  if (session.token && (pathname.startsWith('/auth'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}