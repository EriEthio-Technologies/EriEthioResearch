import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { validateCSRFToken } from '@/lib/csrf';
import { getToken } from 'next-auth/jwt';
import { logSecurityEvent } from '@/lib/audit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
  const token = await getToken({ req });
  
  // Validate JWT token
  if (!token?.role || !['admin', 'superadmin'].includes(token.role)) {
    await logSecurityEvent('unauthorized_api_access', {
      endpoint: req.url,
      token: token
    });
    return new Response('Unauthorized', { status: 401 });
  }

  // Validate content type
  const contentType = req.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return new Response('Invalid content type', { status: 415 });
  }

  // CSRF Validation
  const csrfToken = req.headers.get('X-CSRF-Token');
  if (!validateCSRFToken(csrfToken!)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' }, 
      { status: 403 }
    );
  }

  // IP-based rate limiting
  const identifier = req.headers.get('x-real-ip') || 'anonymous';
  const isAllowed = await limiter.check(10, identifier);

  if (!isAllowed) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      { status: 429 }
    );
  }

  // Request body validation
  const rawBody = await req.text();
  try {
    JSON.parse(rawBody); // Validate JSON structure
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  // Existing API logic
} 