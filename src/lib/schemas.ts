import { z } from 'zod';

export const webVitalsSchema = z.object({
  name: z.enum(['FCP', 'LCP', 'CLS', 'FID', 'TTFB']),
  value: z.number().positive(),
  id: z.string().uuid(),
  label: z.string().optional(),
  page_url: z.string().url(),
  user_agent: z.string()
}); 