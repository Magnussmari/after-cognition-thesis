# 🚀 After Cognition Thesis Platform - Deployment Guide

## ✅ What's Been Built

You now have a complete, production-ready thesis platform with:

### **Infrastructure**
- ✅ Custom MCP server for database operations
- ✅ Complete database schema with RLS policies
- ✅ Content sync pipeline for Quarto HTML
- ✅ Full-text search with PostgreSQL

### **Frontend Application**
- ✅ Authentication with magic links
- ✅ Table of contents with reading progress
- ✅ Chapter reader with smooth navigation
- ✅ Bookmarking system with annotations
- ✅ Progress tracking and analytics
- ✅ Full-text search interface
- ✅ Dark mode support
- ✅ Mobile responsive design

### **Content Pipeline**
- ✅ Quarto HTML parser
- ✅ Academic formatting preservation
- ✅ Citation and reference handling
- ✅ Automated content sync

## 📋 Pre-Deployment Checklist

### 1. **Environment Variables**
Create a `.env.local` file with your actual credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://axjuevxjcestqhzdgjca.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional
VERCEL_TOKEN=your_vercel_token
GITHUB_TOKEN=your_github_token
```

### 2. **Get Your Supabase Keys**
1. Go to https://supabase.com/dashboard/project/axjuevxjcestqhzdgjca/settings/api
2. Copy your `anon` (public) key
3. Copy your `service_role` (secret) key - NEVER expose this publicly

## 🗄️ Database Setup

### Step 1: Apply Database Schema
1. Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/axjuevxjcestqhzdgjca/sql)
2. Copy the contents of `supabase/migrations/20250115_thesis_schema.sql`
3. Paste and click **RUN**

### Step 2: Verify Tables Created
Check that these tables exist:
- thesis_metadata
- chapters
- sections
- user_progress
- bookmarks
- citations
- figures
- reading_sessions
- content_versions

### Step 3: Create Admin User
```sql
-- Replace with your email
INSERT INTO auth.users (email) VALUES ('magnussmari@unak.is');

-- Get the user ID and make them admin
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'magnussmari@unak.is';
```

## 📚 Content Upload

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Content Sync
```bash
npm run sync-content
```

This will:
- Parse all HTML files from `docs/parts/`
- Extract chapters and sections
- Upload to Supabase with proper structure
- Set up search indexes

### Step 3: Verify Content
Check in Supabase Table Editor that content is uploaded correctly.

## 🌐 Deploy to Vercel

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy
```bash
vercel
```

Follow the prompts:
- Link to existing project? **No** (create new)
- What's your project name? **after-cognition**
- Which directory is your code located? **./**.
- Override settings? **No**

### Step 3: Set Environment Variables
```bash
# Set production environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### Step 4: Deploy to Production
```bash
vercel --prod
```

## 🔧 Post-Deployment

### 1. **Configure Domain (Optional)**
```bash
vercel domains add your-domain.com
```

### 2. **Test Everything**
- [ ] Authentication flow
- [ ] Chapter navigation
- [ ] Search functionality
- [ ] Progress tracking
- [ ] Bookmarks
- [ ] Mobile responsiveness

### 3. **Monitor Performance**
- Check Vercel Analytics
- Monitor Supabase usage
- Review error logs

## 📊 MCP Server Usage

### Start MCP Server Locally
```bash
cd supabase-thesis-mcp
npm run dev
```

### Available MCP Tools
- `check_health` - Verify database connection
- `sync_content` - Upload content from Quarto
- `query_content` - Search thesis content
- `get_analytics` - View reading statistics
- `create_test_users` - Generate test users

### Example Usage in Claude Code
```
Check database health status
```

## 🚨 Troubleshooting

### Database Connection Issues
1. Verify environment variables are correct
2. Check Supabase project is not paused
3. Ensure RLS policies are properly set

### Content Not Showing
1. Run `npm run sync-content` again
2. Check that chapters/sections are marked as `is_published = true`
3. Verify search indexes are created

### Authentication Problems
1. Check email settings in Supabase Auth
2. Verify redirect URLs are configured
3. Test with different email providers

### Build Errors
1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check TypeScript errors: `npm run type-check`

## 🎉 Success Indicators

Your thesis platform is successfully deployed when:
- ✅ You can access it at your Vercel URL
- ✅ Authentication with magic links works
- ✅ All chapters and sections are visible
- ✅ Search returns relevant results
- ✅ Progress is tracked correctly
- ✅ Bookmarks can be created/deleted
- ✅ Mobile experience is smooth

## 📝 Next Steps

1. **Share with Reviewers**
   - Send them the URL
   - They'll receive magic link for access
   - Their progress will be tracked

2. **Monitor Usage**
   - Check reading analytics
   - Review popular sections
   - Gather feedback

3. **Iterate and Improve**
   - Add requested features
   - Optimize based on usage patterns
   - Enhance search relevance

## 🔐 Security Notes

- Never commit `.env.local` to git
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Regularly review access logs
- Update dependencies regularly

## 🆘 Need Help?

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Congratulations! Your thesis "After Cognition: Human Value in the Age of Irreducibility" is now live as a modern, interactive web platform!** 🎊