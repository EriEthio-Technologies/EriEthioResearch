import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import { getToken } from 'next-auth/jwt';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'admin';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

    // Redirect non-admin users trying to access admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

// Combined config for both auth and analytics
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Add actual middleware logic here
  return NextResponse.next();
} 