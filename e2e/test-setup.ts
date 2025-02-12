import { test as base } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Extend base test with auth utilities
export const test = base.extend({
  // Authenticate before tests that require auth
  authenticatedPage: async ({ page }, use) => {
    try {
      // Sign in with Supabase directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email: process.env.TEST_USER_EMAIL || 'test@eriethio.com',
        password: process.env.TEST_USER_PASSWORD || 'Test123!@#',
      });

      if (error) throw error;

      // Set auth cookies
      await page.context().addCookies([
        {
          name: 'sb-access-token',
          value: data.session?.access_token || '',
          domain: 'localhost',
          path: '/',
        },
        {
          name: 'sb-refresh-token',
          value: data.session?.refresh_token || '',
          domain: 'localhost',
          path: '/',
        }
      ]);

      // Set up auth state
      await page.evaluate((token) => {
        localStorage.setItem('supabase.auth.token', token);
      }, data.session?.access_token);

      await use(page);
    } catch (error) {
      console.error('Error setting up authenticated page:', error);
      throw error;
    }
  },

  // Authenticate as admin
  adminPage: async ({ page }, use) => {
    try {
      // Sign in with Supabase directly as admin
      const { data, error } = await supabase.auth.signInWithPassword({
        email: process.env.ADMIN_EMAIL || 'admin@eriethio.com',
        password: process.env.ADMIN_PASSWORD || 'Admin123!@#',
      });

      if (error) throw error;

      // Set auth cookies
      await page.context().addCookies([
        {
          name: 'sb-access-token',
          value: data.session?.access_token || '',
          domain: 'localhost',
          path: '/',
        },
        {
          name: 'sb-refresh-token',
          value: data.session?.refresh_token || '',
          domain: 'localhost',
          path: '/',
        }
      ]);

      // Set up auth state
      await page.evaluate((token) => {
        localStorage.setItem('supabase.auth.token', token);
      }, data.session?.access_token);

      await use(page);
    } catch (error) {
      console.error('Error setting up admin page:', error);
      throw error;
    }
  },

  // Clean up after each test
  context: async ({ context }, use) => {
    // Set up context
    context.setDefaultTimeout(30000);
    context.setDefaultNavigationTimeout(30000);

    // Use the context
    await use(context);

    // Clean up
    await context.clearCookies();
    await context.clearPermissions();
  },
});

export { expect } from '@playwright/test'; 