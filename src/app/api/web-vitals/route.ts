import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { securityHeaders } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';
import { webVitalsSchema } from '@/lib/web-vitals-schema';

export const dynamic = 'force-dynamic'; // Add this for proper ISR handling

// Add rate limiting
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500 
});

export async function POST(request: Request) {
  try {
    await limiter.check(5, 'CACHE_TOKEN'); // 5 requests per minute
    const metric = await request.json();
    
    // Validate payload using Zod schema
    const validatedMetric = webVitalsSchema.parse(metric);
    
    // Store in Supabase
    const { error } = await supabaseAdmin
      .from('web_vitals')
      .insert([validatedMetric]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to store metrics' },
        { status: 500, headers: securityHeaders }
      );
    }

    return NextResponse.json(
      { status: 'ok' },
      { headers: securityHeaders }
    );
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: securityHeaders }
    );
  }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      ...securityHeaders,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 