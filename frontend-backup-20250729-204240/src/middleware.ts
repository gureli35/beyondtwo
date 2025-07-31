import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // In development, allow all access
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }

    // In production, check for authentication
    // This is a basic example - implement proper authentication
    const authHeader = request.headers.get('authorization');
    const isAuthenticated = authHeader && authHeader === 'Bearer your-secret-token';

    if (!isAuthenticated) {
      // Redirect to login page or return 401
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
