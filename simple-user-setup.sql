-- Simple user setup for After Cognition
-- This creates a user without password (you'll need to use password reset)

-- Check if user exists
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'magnussmari@unak.is';

-- If no user exists from above query, create one:
INSERT INTO auth.users (
    email,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
) VALUES (
    'magnussmari@unak.is',
    NOW(), -- Confirms email immediately
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin", "full_name": "Magnús Smári Smárason"}',
    'authenticated',
    'authenticated'
) ON CONFLICT (email) DO UPDATE SET
    email_confirmed_at = COALESCE(auth.users.email_confirmed_at, NOW()),
    raw_user_meta_data = jsonb_set(
        COALESCE(auth.users.raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
    );

-- Verify user was created
SELECT id, email, raw_user_meta_data->>'role' as role, email_confirmed_at 
FROM auth.users 
WHERE email = 'magnussmari@unak.is';

-- After running this:
-- 1. Go to https://after-cognition-thesis.vercel.app/auth/setup
-- 2. Click "Setup Admin User" to set the password
-- 3. Or use Supabase Dashboard to manually set a password