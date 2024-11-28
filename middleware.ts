import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public paths that don't require authentication
const publicPaths = ['/auth/phone']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('authToken')?.value

  // Allow access to public paths
  if (publicPaths.includes(pathname)) {
    // If user is authenticated and trying to access auth page, redirect to home
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes - require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/auth/phone', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /manifest.json (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)',
  ],
}
