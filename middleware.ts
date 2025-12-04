import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/login', '/register', '/'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Redirect to login if no token and accessing protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if has token and accessing auth pages
  if (token && isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/vendor/:path*', '/manager/:path*', '/login', '/register']
};