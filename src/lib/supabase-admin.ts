import { createClient } from '@supabase/supabase-js';
import { validateCSRFToken } from '@/lib/csrf';
import { logSecurityEvent } from '@/lib/audit';

interface AdminFunctionParams {
  _page_view_id: string;
  _event_type: string;
  _event_data: Record<string, unknown>;
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
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

export const trackPageEvent = (params: AdminFunctionParams) => 
  supabaseAdmin.rpc('track_page_event', params); 