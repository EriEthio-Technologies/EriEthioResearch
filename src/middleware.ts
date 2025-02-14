import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import { getToken } from 'next-auth/jwt';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      const protectedPaths = [
        '/admin/:path*',
        '/api/admin/:path*',
        '/dashboard',
        '/settings'
      ];
      
      if (!token) return false;
      if (token.role === 'admin') return true;
      
      // Custom permission checks
      return !protectedPaths.some(path => 
        new URL(req.nextUrl.pathname, req.url).pathname.startsWith(path)
      );
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
});

// Combined config for both auth and analytics
export const config = {
  matcher: [
    '/((?!api/web-vitals|_next/static|_next/image|favicon.ico).*)',
  ]
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Add actual middleware logic here
  return NextResponse.next();
} 