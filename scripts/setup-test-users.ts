import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from both files
dotenv.config({ path: '.env.test' });
dotenv.config({ path: '.env.local' }); // This will override test vars if they exist

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'TEST_USER_EMAIL',
  'TEST_USER_PASSWORD',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Create Supabase admin client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Add debug logging
console.log('Initializing with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Service Role Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

// Helper function to get user by email from auth
async function getUserByEmailFromAuth(email: string) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) {
    throw error;
  }

  const user = data.users.find(u => u.email === email);
  return user;
}

// Helper function to create or update profile
async function createOrUpdateProfile(userId: string, email: string, fullName: string, role: 'user' | 'admin') {
  console.log('Creating/updating profile for user:', userId);
  
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: userId,
      email,
      full_name: fullName,
      role
    }, {
      onConflict: 'id'
    });

  if (profileError) {
    console.error('Error in creating user profile:', profileError);
    throw profileError;
  }
}

// Main setup function
async function setupTestUsers() {
  try {
    console.log('Setting up test user...');
    
    // Try to get existing test user
    let testUser = await getUserByEmailFromAuth(process.env.TEST_USER_EMAIL!);
    
    if (!testUser) {
      console.log('Creating new test user...');
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: process.env.TEST_USER_EMAIL!,
        password: process.env.TEST_USER_PASSWORD!,
        email_confirm: true
      });

      if (error) {
        console.error('Error creating test user:', error);
        throw error;
      }

      testUser = data.user;
    } else {
      console.log('Test user already exists, updating profile...');
    }

    if (!testUser?.id) {
      throw new Error('Failed to get test user ID');
    }

    console.log('Creating/updating test user profile...');
    await createOrUpdateProfile(
      testUser.id,
      process.env.TEST_USER_EMAIL!,
      'Test User',
      'user'
    );

    // Try to get existing admin user
    let adminUser = await getUserByEmailFromAuth(process.env.ADMIN_EMAIL!);
    
    if (!adminUser) {
      console.log('Creating new admin user...');
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!,
        email_confirm: true
      });

      if (error) {
        console.error('Error creating admin user:', error);
        throw error;
      }

      adminUser = data.user;
    } else {
      console.log('Admin user already exists, updating profile...');
    }

    if (!adminUser?.id) {
      throw new Error('Failed to get admin user ID');
    }

    console.log('Creating/updating admin user profile...');
    await createOrUpdateProfile(
      adminUser.id,
      process.env.ADMIN_EMAIL!,
      'Admin User',
      'admin'
    );

    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error in setupTestUsers:', error);
    throw error;
  }
}

// Run setup
setupTestUsers().catch(error => {
  console.error('Fatal error during setup:', error);
  process.exit(1);
}); 