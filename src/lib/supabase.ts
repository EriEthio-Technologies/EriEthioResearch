import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single instance of the Supabase client
class SupabaseClient {
  private static instance: ReturnType<typeof createClient> | null = null;
  private static adminInstance: ReturnType<typeof createClient> | null = null;

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

  public static getAdminInstance() {
    if (!this.adminInstance) {
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseServiceKey) {
        throw new Error('Missing Supabase service role key');
      }

      this.adminInstance = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
    return this.adminInstance;
  }
}

// Export singleton instances
export const supabase = SupabaseClient.getInstance();
export const supabaseAdmin = SupabaseClient.getAdminInstance(); 