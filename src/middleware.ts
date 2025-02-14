import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
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
  // Example security headers
  const response = NextResponse.next();
  
  // Set security headers
  response.headers.set('Content-Security-Policy', "default-src 'self'");
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
} 