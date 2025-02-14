import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXTAUTH_URL}/auth/reset-password`,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send reset password email' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Password reset email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 