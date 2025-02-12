import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const metric = await request.json();

    const { error } = await supabase
      .from('web_vitals')
      .insert([{
        name: metric.name,
        value: metric.value,
        id: metric.id,
        label: metric.label,
        page_url: metric.page || '/',
        user_agent: request.headers.get('user-agent'),
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving web vitals:', error);
    return NextResponse.json(
      { error: 'Failed to save web vitals' },
      { status: 500 }
    );
  }
} 