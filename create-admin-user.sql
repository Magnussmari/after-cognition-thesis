-- Create admin user for After Cognition thesis platform
-- Run this in Supabase SQL Editor

-- First, check if user already exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'magnussmari@unak.is') THEN
        -- Insert new user
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            aud,
            role,
            created_at,
            updated_at,
            confirmation_sent_at,
            instance_id
        ) VALUES (
            gen_random_uuid(),
            'magnussmari@unak.is',
            crypt('temp-password-change-me', gen_salt('bf')),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"role": "admin", "full_name": "Magnús Smári Smárason"}',
            'authenticated',
            'authenticated',
            NOW(),
            NOW(),
            NOW(),
            '00000000-0000-0000-0000-000000000000'
        );
        
        RAISE NOTICE 'User created successfully!';
    ELSE
        -- Update existing user to admin
        UPDATE auth.users 
        SET 
            raw_user_meta_data = jsonb_set(
                COALESCE(raw_user_meta_data, '{}'::jsonb),
                '{role}',
                '"admin"'
            ),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW())
        WHERE email = 'magnussmari@unak.is';
        
        RAISE NOTICE 'User updated to admin!';
    END IF;
END $$;

-- Verify the user was created/updated
SELECT id, email, raw_user_meta_data->>'role' as role, email_confirmed_at 
FROM auth.users 
WHERE email = 'magnussmari@unak.is';

-- Instructions for logging in:
-- 1. After running this script, go to: https://after-cognition-thesis.vercel.app/auth/login
-- 2. Use these credentials:
--    Email: magnussmari@unak.is
--    Password: temp-password-change-me
-- 3. Click "Sign In"

-- Note: You should change the password after first login for security!