import { z } from 'zod';

const envSchema = z.object({
  // Required
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  
  // Optional
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(),
  
  // Third-party services
  SENTRY_DSN: z.string().optional(),
  GA_TRACKING_ID: z.string().optional(),
});

export const env = envSchema.parse(process.env); 