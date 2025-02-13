import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication error' }, { status: 401 });
  }

  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: session.user,
    expires: session.expires_at ? new Date(session.expires_at).toISOString() : null,
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'signIn':
        const { email, password } = body;
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;
        return NextResponse.json(data);

      case 'signOut':
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 401 }
    );
  }
} 