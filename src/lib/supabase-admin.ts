import { createServerClient } from '@supabase/ssr';
import { validateCSRFToken } from '@/lib/csrf';
import { logSecurityEvent } from '@/lib/audit';

export const supabaseAdmin = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Origin': process.env.NODE_ENV === 'production' 
          ? 'https://eriethioresearch.com' 
          : 'http://localhost:3333',
        'X-Service-Role': 'true'
      }
    }
  }
);

export const withAdminValidation = (handler: Function) => async (req: Request) => {
  const csrfToken = req.headers.get('X-CSRF-Token');
  const serviceRole = req.headers.get('X-Service-Role');
  
  if (!validateCSRFToken(csrfToken!) || serviceRole !== 'true') {
    await logSecurityEvent('invalid_auth_attempt', {
      headers: Object.fromEntries(req.headers),
      path: req.url
    });
    return new Response('Unauthorized', { status: 401 });
  }
  
  return handler(req);
}; 