import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session-token';

/**
 * Optimistic auth check for /admin: bounce visitors without a valid session
 * cookie to the login page before any rendering happens. The authoritative
 * checks live in src/lib/auth.ts (layout + every Server Action).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === '/admin/login') {
    return authed ? NextResponse.redirect(new URL('/admin', request.url)) : NextResponse.next();
  }
  if (!authed) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
