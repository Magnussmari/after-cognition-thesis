#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  console.log('🚀 Creating admin user...');
  
  try {
    // First, delete any existing user
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === 'magnussmari@unak.is');
    
    if (existingUser) {
      console.log('User already exists, deleting...');
      await supabase.auth.admin.deleteUser(existingUser.id);
    }
    
    // Create new user with password
    const { data: user, error } = await supabase.auth.admin.createUser({
      email: 'magnussmari@unak.is',
      password: 'temp-password-change-me',
      email_confirm: true,
      user_metadata: {
        full_name: 'Magnús Smári Smárason',
        role: 'admin'
      }
    });
    
    if (error) {
      console.error('Error creating user:', error);
      return;
    }
    
    console.log('✅ User created successfully!');
    console.log('📧 Email:', user.user.email);
    console.log('🔑 Password: temp-password-change-me');
    console.log('');
    console.log('You can now login at:');
    console.log('https://after-cognition-thesis.vercel.app/auth/login');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser();