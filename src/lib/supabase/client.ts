import { createClient } from '@supabase/supabase-js';

// This file is specifically for client-side Supabase usage
// It ensures we only create one instance of the client

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single instance of the Supabase client for client-side use
class ClientSupabase {
  private static instance: ReturnType<typeof createClient> | null = null;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'supabase.auth.token',
        },
      });
    }
    return this.instance;
  }
}

// Export a function to get the client instance
export const createClient = () => ClientSupabase.getInstance();

// For direct usage when you don't need to call createClient()
export const supabase = ClientSupabase.getInstance(); 