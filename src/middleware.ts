import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

// Combined config for both auth and analytics
export const config = {
  matcher: [
    // Auth protected routes
    '/dashboard/:path*',
    '/research/:path*',
    '/products/:path*',
    '/api/protected/:path*',
    // Analytics tracking (exclude static files)
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};

export async function middleware(request: NextRequest) {
  try {
    // Only track page views for GET requests
    if (request.method !== 'GET') {
      return NextResponse.next();
    }

    // Skip tracking for static files and API routes
    const { pathname } = request.nextUrl;
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/static') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.gif') ||
      pathname.endsWith('.svg')
    ) {
      return NextResponse.next();
    }

    // Create a Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: { path: string }) {
            // This is handled by the Supabase client
          },
          remove(name: string, options: { path: string }) {
            // This is handled by the Supabase client
          },
        },
      }
    );

    // Get the current user if logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get or create a session ID
    let sessionId = request.cookies.get('session_id')?.value;
    if (!sessionId) {
      sessionId = nanoid();
    }

    // Track the page view
    const { data: page } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', pathname === '/' ? 'home' : pathname.slice(1))
      .single();

    let pageViewId: string | null = null;

    if (page) {
      const { data } = await supabase.rpc('track_page_view', {
        _page_id: page.id,
        _path: pathname,
        _user_id: user?.id,
        _session_id: sessionId,
        _referrer: request.headers.get('referer'),
        _user_agent: request.headers.get('user-agent'),
      });
      pageViewId = data;
    }

    // Create a new response
    const response = NextResponse.next();

    // Set the session ID cookie if it doesn't exist
    if (!request.cookies.get('session_id')) {
      response.cookies.set('session_id', sessionId, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // Add script to store page view ID in localStorage
    if (pageViewId) {
      const script = `
        <script>
          localStorage.setItem('current_page_view_id', '${pageViewId}');
        </script>
      `;

      const html = await response.text();
      const modifiedHtml = html.replace('</head>', `${script}</head>`);
      
      return new NextResponse(modifiedHtml, {
        status: 200,
        headers: response.headers,
      });
    }

    return response;
  } catch (error) {
    console.error('Error in analytics middleware:', error);
    return NextResponse.next();
  }
} 