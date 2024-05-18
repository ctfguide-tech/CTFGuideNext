import { NextResponse } from 'next/server'

export function middleware(req) {
 const { pathname } = req.nextUrl;

 if (
    pathname.startsWith("/api") || // exclude all API routes
    pathname.startsWith("/static") || // exclude static files
    pathname.includes(".") // exclude all files in the public folder
  )
  return NextResponse.next();

  const idToken = req.cookies.get('idToken');

  // ensure token is valid 
  // basic request to server to ensure that the token is valid

  

  if (!idToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico|login|careers|register|onboarding|userrs|privacy-policy|404|terms-of-service|learn|$).*)'],
}
