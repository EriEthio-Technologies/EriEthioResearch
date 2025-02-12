import { FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function globalTeardown(config: FullConfig) {
  const authFile = path.resolve(__dirname, '../.auth/user.json');

  // Clean up auth state
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile);
  }

  // Clean up test data
  try {
    // Delete test pages
    await supabase
      .from('pages')
      .delete()
      .eq('title', process.env.TEST_PAGE_TITLE);

    await supabase
      .from('pages')
      .delete()
      .eq('title', 'Test Page');

    await supabase
      .from('pages')
      .delete()
      .eq('title', 'Edit Test Page');

    // Delete test products
    await supabase
      .from('products')
      .delete()
      .eq('title', process.env.TEST_PRODUCT_NAME);

    await supabase
      .from('products')
      .delete()
      .eq('title', 'Test Product');

    // Delete test research projects
    await supabase
      .from('research_projects')
      .delete()
      .eq('title', process.env.TEST_RESEARCH_TITLE);

    await supabase
      .from('research_projects')
      .delete()
      .eq('title', 'Test Research Project');

    // Clean up any test users (except admin)
    await supabase
      .from('profiles')
      .delete()
      .eq('email', 'test@example.com');

    // Clean up test analytics data
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    await supabase
      .from('page_views')
      .delete()
      .gt('created_at', oneDayAgo.toISOString());

    await supabase
      .from('page_events')
      .delete()
      .gt('created_at', oneDayAgo.toISOString());

  } catch (error) {
    console.error('Error cleaning up test data:', error);
    // Don't throw here, as cleanup is not critical
  }
}

export default globalTeardown; 