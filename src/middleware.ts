import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import { getToken } from 'next-auth/jwt';
import { securityHeaders } from '@/lib/security';

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
    '/((?!api/web-vitals|_next/static|_next/image|favicon.ico|api/auth).*)',
  ]
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // API-specific cache control
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
  }

  response.headers.set('Content-Security-Policy', `
    default-src 'self';
    script-src 'self' 'unsafe-inline' *.sentry.io cdn.framer.com;
    style-src 'self' 'unsafe-inline' *.framer.com;
    img-src 'self' data: *.supabase.co *.framerusercontent.com;
    connect-src 'self' *.supabase.co;
    frame-src 'self' *.youtube.com *.vimeo.com;
  `.replace(/\n/g, ' '));

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
} 