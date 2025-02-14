import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
  const identifier = req.headers.get('x-real-ip') || 'anonymous';
  const isAllowed = await limiter.check(10, identifier);

  if (!isAllowed) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      { status: 429 }
    );
  }

  // Existing API logic
} 