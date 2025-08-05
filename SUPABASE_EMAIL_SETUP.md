# 📧 Supabase Email Configuration Guide

## Problem
Magic link emails are not being sent when users try to log in.

## Solutions

### Option 1: Enable Email in Supabase Dashboard (Recommended)

1. **Go to your Supabase project**:
   https://supabase.com/dashboard/project/axjuevxjcestqhzdgjca

2. **Navigate to Authentication → Configuration**:
   - Click on "Authentication" in the sidebar
   - Go to "Configuration" tab
   - Scroll to "Email" section

3. **Check these settings**:
   - ✅ Enable Email provider
   - ✅ Confirm email enabled
   - ✅ Check "Site URL": Should be `https://after-cognition-thesis.vercel.app`
   - ✅ Add redirect URLs:
     ```
     https://after-cognition-thesis.vercel.app/**
     https://*.vercel.app/**
     http://localhost:3000/**
     ```

4. **Check Email Templates**:
   - Go to "Email Templates" tab
   - Make sure "Magic Link" template is active
   - Default template should work fine

### Option 2: Use Inbucket for Testing (Local Development)

Supabase provides a local email testing tool called Inbucket:

1. **Access Inbucket**:
   - URL pattern: `https://axjuevxjcestqhzdgjca.supabase.co/inbucket`
   - This shows all emails sent by your project

2. **Check for rate limiting**:
   - Free tier has email limits
   - Check if emails are queued in Inbucket

### Option 3: Custom SMTP (Production)

For production, configure custom SMTP:

1. Go to **Settings** → **Auth**
2. Scroll to "SMTP Settings"
3. Enable "Custom SMTP"
4. Add your SMTP credentials (SendGrid, AWS SES, etc.)

### Option 4: For Quick Testing - Direct Database User Creation

1. **Go to SQL Editor** in Supabase Dashboard
2. **Create a test user**:
   ```sql
   -- Create user directly
   INSERT INTO auth.users (
     email,
     email_confirmed_at,
     raw_app_meta_data,
     raw_user_meta_data,
     created_at,
     updated_at
   ) VALUES (
     'magnussmari@unak.is',
     NOW(),
     '{"provider": "email", "providers": ["email"]}',
     '{"role": "admin"}',
     NOW(),
     NOW()
   );
   ```

3. **Get the user ID and create a login session manually**

### Debugging Steps

1. **Check Supabase Logs**:
   - Go to **Settings** → **Logs**
   - Filter by "auth" to see authentication attempts

2. **Verify Email Settings in Code**:
   Check that the redirect URL in login is correct:
   ```typescript
   emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`
   ```

3. **Common Issues**:
   - Rate limiting (4 emails per hour on free tier)
   - Incorrect Site URL configuration
   - Missing redirect URLs
   - Email provider disabled

## Quick Fix for Now

Since you need to access the platform immediately:

1. **Use the Table Editor**:
   - Go to Table Editor → auth.users
   - Click "Insert row"
   - Add your email
   - Set `email_confirmed_at` to current timestamp

2. **Or use this SQL**:
   ```sql
   -- Quick user creation
   INSERT INTO auth.users (email, email_confirmed_at)
   VALUES ('your-email@example.com', NOW())
   RETURNING id;
   ```

3. **Then access the site** - you'll be logged in automatically

## Production Setup

For production, you should:
1. Configure custom SMTP
2. Set proper redirect URLs
3. Customize email templates
4. Set up proper rate limiting

---

**Note**: The magic link feature is working correctly in your code. The issue is with Supabase email configuration or rate limiting.