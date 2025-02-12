import { chromium, FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

// Create service role client for admin operations
const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle errors
const handleError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  throw error;
};

// Helper function to start dev server
async function startDevServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NEXT_PUBLIC_ENABLE_E2E_TESTING: 'true',
        NODE_ENV: 'test'
      }
    });

    server.on('error', (error) => {
      handleError(error, 'starting dev server');
    });

    server.on('spawn', () => {
      // Wait for server to be ready
      setTimeout(resolve, 5000, server);
    });
  });
}

// Helper function to wait for server
async function waitForServer(page: any) {
  let retries = 0;
  const maxRetries = 5;
  
  while (retries < maxRetries) {
    try {
      await page.goto(process.env.NEXTAUTH_URL || 'http://localhost:3000');
      return process.env.NEXTAUTH_URL || 'http://localhost:3000';
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        handleError(error, 'waiting for server');
      }
      await wait(2000);
    }
  }
}

async function globalSetup(config: FullConfig) {
  const { storageState } = config.projects[0].use;
  const authFile = path.resolve(__dirname, '../.auth');

  // Ensure auth directory exists
  if (!fs.existsSync(authFile)) {
    fs.mkdirSync(authFile, { recursive: true });
  }

  let server;
  try {
    // Clean up existing test data
    console.log('Cleaning up existing test data...');
    await serviceClient
      .from('pages')
      .delete()
      .eq('title', process.env.TEST_PAGE_TITLE);
    
    await serviceClient
      .from('products')
      .delete()
      .eq('title', process.env.TEST_PRODUCT_NAME);
    
    await serviceClient
      .from('research_projects')
      .delete()
      .eq('title', process.env.TEST_RESEARCH_TITLE);

    await wait(2000);

    // Start dev server
    server = await startDevServer();

    // Set up browser
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Wait for server and get base URL
      const baseUrl = await waitForServer(page);

      // Sign in through the UI
      await page.goto(`${baseUrl}/auth/signin`);
      await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL!);
      await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD!);
      await page.click('button[type="submit"]');

      // Wait for navigation to dashboard
      await page.waitForURL(`${baseUrl}/dashboard`);

      // Save signed-in state
      await context.storageState({ path: storageState as string });
    } catch (error) {
      handleError(error, 'browser setup');
    } finally {
      await browser.close();
    }

    // Set up initial test data
    try {
      console.log('Setting up test data...');
      
      // Create test page
      const { error: pageError } = await serviceClient
        .from('pages')
        .insert([{
          title: process.env.TEST_PAGE_TITLE,
          slug: process.env.TEST_PAGE_SLUG,
          status: 'published',
          sections: []
        }]);

      if (pageError) handleError(pageError, 'creating test page');
      
      // Create test product
      const { error: productError } = await serviceClient
        .from('products')
        .insert([{
          title: process.env.TEST_PRODUCT_NAME,
          status: 'active',
          description: 'Test product description'
        }]);

      if (productError) handleError(productError, 'creating test product');
      
      // Create test research project
      const { error: researchError } = await serviceClient
        .from('research_projects')
        .insert([{
          title: process.env.TEST_RESEARCH_TITLE,
          status: 'in_progress',
          description: 'Test research project description'
        }]);

      if (researchError) handleError(researchError, 'creating test research');

      console.log('Test data setup completed successfully!');
    } catch (error) {
      handleError(error, 'test data setup');
    }
  } catch (error) {
    handleError(error, 'global setup');
  } finally {
    if (server) {
      server.kill();
    }
  }
}

export default globalSetup; 