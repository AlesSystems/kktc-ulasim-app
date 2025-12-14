import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Admin login sayfası için kontrol yapma
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }
  
  // Admin rotalarını koru
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get(ADMIN_COOKIE_NAME);
    
    if (!session || session.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
