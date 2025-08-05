#!/bin/bash

echo "🚀 Setting up After Cognition Thesis with Supabase Authentication"
echo "================================================================="

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🔐 Database Setup Required"
echo "========================="
echo "Please manually run the database migration in Supabase Dashboard:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Open SQL Editor"
echo "3. Run the contents of: supabase/migrations/20250110_initial_schema.sql"
echo ""

echo "👤 Create Your Admin Account"
echo "============================"
echo "After running the migration, create your admin user:"
echo "1. Go to Authentication > Users in Supabase Dashboard"
echo "2. Add user with email: $ADMIN_EMAIL"
echo "3. Run this SQL to make yourself admin:"
echo ""
echo "UPDATE public.profiles SET role = 'admin' WHERE email = '$ADMIN_EMAIL';"
echo "INSERT INTO public.thesis_access (user_id, thesis_id, access_level, granted_by)"
echo "SELECT id, 'after-cognition', 'admin', id FROM public.profiles WHERE email = '$ADMIN_EMAIL';"
echo ""

echo "🌐 Starting Development Server"
echo "=============================="
echo "Once database setup is complete, access your thesis at:"
echo "http://localhost:3000"
echo ""

# Start the development server
npm run dev
