import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single instance of the Supabase client
const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createClient> | undefined;
  supabaseAdmin: ReturnType<typeof createClient> | undefined;
};

export const supabase =
  globalForSupabase.supabase ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token',
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase;
}

// For admin operations (server-side only)
export function getSupabaseAdmin() {
  if (globalForSupabase.supabaseAdmin) return globalForSupabase.supabaseAdmin;

  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    throw new Error('Missing Supabase service role key');
  }

  const admin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForSupabase.supabaseAdmin = admin;
  }

  return admin;
} 