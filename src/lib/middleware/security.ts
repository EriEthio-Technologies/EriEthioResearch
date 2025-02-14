import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateCSRFToken } from '@/lib/csrf';
import { logSecurityEvent } from '@/lib/audit';

export async function securityMiddleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const response = NextResponse.next();
  
  // CSP Configuration
  response.headers.set('Content-Security-Policy', `
    default-src 'none';
    script-src 'self' 'unsafe-inline' *.sentry.io;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: *.supabase.co;
    font-src 'self';
    connect-src 'self' *.supabase.co;
    frame-src 'self';
    base-uri 'self';
    form-action 'self';
  `.replace(/\n/g, ' '));

  // Admin path protection
  if (path.startsWith('/admin')) {
    if (!req.cookies.get('next-auth.session-token')) {
      await logSecurityEvent('admin_access_attempt', { path });
      return NextResponse.redirect(new URL('/auth/error', req.url));
    }
  }

  return response;
} 