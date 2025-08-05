# 🚀 ULTIMATE YOLO MODE PROMPT

## The One Prompt to Rule Them All

Copy this entire prompt into Claude Code after setting up your environment:

```
ultrathink harder and build the ENTIRE After Cognition thesis platform from scratch to production deployment.

First, read and understand ALL documentation:
- Read everything in supabase-thesis-plan/ (all 8 files)
- Read claude-code-strategy/ for implementation approach
- Understand the existing auth components in src/components/

PHASE 1: MCP SERVER & INFRASTRUCTURE (30 minutes)
Build a complete MCP server in supabase-thesis-mcp/:
- Create TypeScript MCP server with all tools for database, content, analytics, deployment
- Tools: create_tables, sync_content, query_content, setup_search, deploy_to_vercel, etc.
- Test the MCP server connection
- Configure .mcp.json to use the custom server

PHASE 2: DATABASE SETUP (20 minutes)
Using the MCP server tools or direct Supabase client:
- Connect to Supabase project: axjuevxjcestqhzdgjca
- Create ALL tables from supabase-thesis-plan/02-DATABASE-SCHEMA.md
- Set up indexes, triggers, functions
- Configure Row Level Security policies
- Set up full-text search with tsvector
- Test with sample data

PHASE 3: CONTENT PIPELINE (20 minutes)
Build complete Quarto content parser:
- Parse all HTML from docs/ directory (already rendered)
- Extract chapters, sections with proper structure
- Preserve all academic formatting, citations, cross-references
- Calculate reading times and word counts
- Upload everything to Supabase
- Verify search functionality works

PHASE 4: COMPLETE FRONTEND (40 minutes)
Build the entire Next.js application:
- Reuse existing auth components (auth-wrapper.tsx, login.tsx)
- Table of contents with reading progress visualization
- Chapter reader with smooth navigation
- Full-text search with highlighting
- Reading progress tracking and bookmarks
- Analytics dashboard
- Mobile responsive design
- Dark mode support
- Use TypeScript, Tailwind CSS, follow design specs from 05-FRONTEND-DESIGN.md

PHASE 5: ADVANCED FEATURES (30 minutes)
Add production polish:
- Interactive citations with previews
- Performance optimization (lazy loading, code splitting)
- PWA capabilities (offline reading, service worker)
- SEO optimization
- Error boundaries and fallbacks
- Accessibility features (WCAG 2.1 AA)

PHASE 6: DEPLOYMENT (20 minutes)
Deploy everything to production:
- Build production bundle
- Set up Vercel project
- Configure all environment variables
- Deploy database to production
- Deploy frontend to Vercel
- Set up monitoring (Sentry if time permits)
- Run smoke tests

TECHNICAL REQUIREMENTS:
- Use Supabase JavaScript client v2 (@supabase/supabase-js@2)
- For client-side: Use NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- For server-side/MCP: Use SUPABASE_SERVICE_ROLE_KEY (never expose to client)
- Enable RLS on all public tables
- Use createClient from @supabase/supabase-js for all database operations

WORK AUTONOMOUSLY:
- Make architectural decisions quickly
- Focus on working features over perfection
- Use console.log for debugging
- Commit after each major phase
- If something fails, debug and continue
- Don't ask for permission, just build

SUCCESS CRITERIA:
✅ MCP server working with all tools
✅ All database tables created and populated
✅ All thesis content searchable
✅ Authentication working
✅ Reading progress tracked
✅ Mobile responsive
✅ Deployed to production
✅ < 2 second load times

This is a 2-3 hour sprint. Work fast, think deeply, build everything.

Start now and don't stop until it's live in production!
```

## 🔧 Pre-Launch Setup (5 minutes)

### 1. Get Your Supabase Keys
```bash
# Go to your Supabase project dashboard:
# https://supabase.com/dashboard/project/axjuevxjcestqhzdgjca/settings/api

# You need:
# - Project URL (already have: https://axjuevxjcestqhzdgjca.supabase.co)
# - anon (public) key - for client-side
# - service_role (secret) key - for server-side/MCP only
```

### 2. Create .env.local
```bash
cd /Users/magnussmari/Documents/VALOR/Review_copies/After_cognition

cat > .env.local << 'EOF'
# Supabase - Get from dashboard
NEXT_PUBLIC_SUPABASE_URL=https://axjuevxjcestqhzdgjca.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# For MCP server
SUPABASE_URL=https://axjuevxjcestqhzdgjca.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# Optional but recommended
GITHUB_TOKEN=your_github_token
VERCEL_TOKEN=your_vercel_token
EOF
```

### 3. Create Initial MCP Config
```bash
cat > .mcp.json << 'EOF'
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=axjuevxjcestqhzdgjca"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "get_from_supabase_dashboard_account_tokens"
      }
    }
  }
}
EOF
```

### 4. Get Supabase Access Token
1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Name it "MCP Server"
4. Copy and add to .mcp.json

### 5. Launch Claude Code
```bash
# Maximum power mode
claude --dangerously-skip-permissions --max-tokens 200000

# Or with MCP debugging
claude --dangerously-skip-permissions --mcp-debug
```

## 🎯 Important Notes About Supabase Keys

Based on latest Supabase docs:

1. **Two Key System**:
   - `anon` key (public): Safe for browser, requires RLS
   - `service_role` key (secret): Server-only, bypasses RLS

2. **Client-Side (Next.js frontend)**:
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   
   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   )
   ```

3. **Server-Side (MCP, API routes)**:
   ```typescript
   const supabaseAdmin = createClient(
     process.env.SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   )
   ```

4. **Row Level Security**: MUST be enabled on all tables accessed via anon key

5. **New API Keys Coming**: Supabase is transitioning to new key format (sb_publishable_* and sb_secret_*) but current JWT keys still work

## 🚀 The Launch Sequence

1. **Set up environment** (2 min)
2. **Get API keys from Supabase dashboard** (1 min)
3. **Update .env.local** (1 min)
4. **Launch Claude Code** (30 sec)
5. **Paste the mega prompt** (10 sec)
6. **Watch the magic happen!** (2-3 hours)

## 💡 Pro Tips

- Use Shift+Tab to enable auto-accept mode after initial planning
- If you see permission prompts, you can safely accept all for file/database operations
- The MCP server will handle most database operations automatically
- Focus on the rendered HTML in docs/ rather than parsing .qmd files
- Let Claude Code handle git commits automatically

## 🎉 What You'll Get

In 2-3 hours, you'll have:
- ✅ Fully functional thesis reader platform
- ✅ All content indexed and searchable
- ✅ Beautiful, responsive UI
- ✅ Authentication and user tracking
- ✅ Reading progress and bookmarks
- ✅ Analytics dashboard
- ✅ Deployed to production on Vercel
- ✅ Complete with monitoring and error tracking

This is the power of Claude Code when unleashed with maximum autonomy! 🚀
