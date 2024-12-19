import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public paths that don't require authentication
const publicPaths = ['/auth/phone', '/onboarding'];

// List of public asset paths that should bypass authentication
const publicAssetPaths = [
  '/images',
  '/static',
  '/_next/image',
  '/_next/static',
  '/favicon.ico',
  '/manifest.json'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;
  const hasSeenOnboarding = request.cookies.get('hasSeenOnboarding')?.value;

  // Allow access to public assets without authentication
  if (publicAssetPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Special handling for root path and onboarding flow
  if (pathname === '/') {
    if (!hasSeenOnboarding) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
    if (!token) {
      return NextResponse.redirect(new URL('/auth/phone', request.url));
    }
    return NextResponse.next();
  }

  // Always allow access to onboarding
  if (pathname === '/onboarding') {
    if (hasSeenOnboarding && token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Handle auth page
  if (pathname === '/auth/phone') {
    if (!hasSeenOnboarding) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!hasSeenOnboarding) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }
  if (!token) {
    return NextResponse.redirect(new URL('/auth/phone', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api (API routes)
     * 2. Static files and images are now handled in the middleware function
     */
    '/((?!api).*)',
  ],
};
