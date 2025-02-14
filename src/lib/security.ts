import { generateCSRFToken, validateCSRFToken } from '@/lib/csrf';

export const securityHeaders = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' *.sentry.io cdn.framer.com;
    style-src 'self' 'unsafe-inline' *.framer.com;
    img-src 'self' data: *.supabase.co *.framerusercontent.com;
    frame-src 'self' *.framer.com *.youtube.com *.vimeo.com;
  `.replace(/\n\s+/g, ' '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN'
}; 