# Supabase Database Setup Instructions

## Manual Migration Required

Since the automated migration failed due to network connectivity, please manually apply the database schema by following these steps:

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Navigate to your "After Cognition" project
4. Click on the "SQL Editor" tab in the left sidebar

### Step 2: Run the Migration
1. Create a new query in the SQL Editor
2. Copy and paste the entire contents of `supabase/migrations/20250110_initial_schema.sql`
3. Click "Run" to execute the migration

### Step 3: Verify the Setup
After running the migration, verify that the following tables were created:
- `profiles`
- `thesis_access`
- `audit_log`

### Step 4: Create Your Admin User
1. Go to the "Authentication" tab in Supabase dashboard
2. Click "Add user" 
3. Enter your email address
4. Once created, go to the SQL Editor and run:
```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Grant yourself thesis access
INSERT INTO public.thesis_access (user_id, thesis_id, access_level, granted_by)
SELECT id, 'after-cognition', 'admin', id
FROM public.profiles 
WHERE email = 'your-email@example.com';
```

### Step 5: Update Environment Variables
Make sure your `.env.local` file has the correct values:
- NEXT_PUBLIC_SUPABASE_URL=https://axjuevxjcestqhzdgjca.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY=(your publishable key)
- SUPABASE_SERVICE_ROLE_KEY=(your secret key)

### Step 6: Test the Setup
Once the database is set up, you can test the authentication system:
```bash
npm run dev
```

Then visit `http://localhost:3000` to test the authentication flow.

## Security Notes
- All tables have Row Level Security (RLS) enabled
- Users can only access their own data unless they're admins
- All access attempts are logged in the audit_log table
- Magic link authentication is used for passwordless security
