import { z } from 'zod';

const envSchema = z.object({
  // Required
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  
  // Optional
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(),
  
  // Third-party services
  SENTRY_DSN: z.string().url().optional(),
  GA_TRACKING_ID: z.string().optional(),

  // New fields
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
});

export const env = envSchema.parse(process.env); 