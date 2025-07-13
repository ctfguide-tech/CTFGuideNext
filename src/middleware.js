import { NextResponse } from 'next/server'

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Exclude API routes and static files
  if (
    pathname.startsWith("/api") || // Exclude all API routes
    pathname.startsWith("/static") || // Exclude static files
    pathname.includes(".") // Exclude all files in the public folder
  ) {
    return NextResponse.next();
  }

  // List of paths that don't require authentication
  const publicPaths = [
    '/',
    '/login',
    '/careers',
    '/register',
    '/onboarding',
    '/forgot-password',
    '/education',
    '/userrs',
    '/privacy-policy',
    '/404',
    '/terms-of-service',
    '/learn',
  ];

  // Allow access to public paths, even with query parameters
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow access to specific challenge pages (UUID format)
  const challengePathRegex = /^\/challenges\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
  if (challengePathRegex.test(pathname)) {
    return NextResponse.next();
  }

  const idToken = req.cookies.get('idToken');

  // Redirect to login if token is missing or invalid
  if (!idToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
}
