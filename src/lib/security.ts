import { generateCSRFToken, validateCSRFToken } from '@/lib/csrf';

export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' *.sentry.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.supabase.co; font-src 'self'; connect-src 'self' *.supabase.co; frame-src 'self' *.youtube.com *.vimeo.com;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-CSRF-Token': generateCSRFToken()
}; 