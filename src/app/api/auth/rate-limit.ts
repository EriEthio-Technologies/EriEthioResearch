import { rateLimit } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500 
});

export const applyRateLimit = (request: Request) => {
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = limiter.check(20, identifier);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' }, 
      { status: 429, headers: securityHeaders }
    );
  }
}; 