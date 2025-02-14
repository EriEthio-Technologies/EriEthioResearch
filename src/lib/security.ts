import { generateCSRFToken, validateCSRFToken } from '@/lib/csrf';

interface CSRFToken {
  token: string;
  expires: Date;
}

export function generateCSRFToken(): CSRFToken {
  return {
    token: crypto.randomUUID(),
    expires: new Date(Date.now() + 3600000)
  };
}

export function validateCSRFToken(token: string, storedToken: CSRFToken): boolean {
  return token === storedToken.token && new Date() < storedToken.expires;
}

export const securityHeaders = {
  'Content-Security-Policy': `default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://*.supabase.co; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';`,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
}; 