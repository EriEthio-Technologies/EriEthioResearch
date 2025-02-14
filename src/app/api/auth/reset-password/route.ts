export async function POST(req: NextRequest) {
  const { password } = await req.json();
  
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.updateUser({ password });

    if (error) throw error;
    
    return NextResponse.json(
      { success: true },
      { status: 200, headers: securityHeaders }
    );
  } catch (error) {
    console.error('Password reset failed:', error);
    return NextResponse.json(
      { error: 'Password reset failed' },
      { status: 500, headers: securityHeaders }
    );
  }
} 