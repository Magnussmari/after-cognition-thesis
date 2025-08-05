# CLAUDE.md - Project Context for After Cognition

## Project Overview
Building a dynamic, database-driven thesis platform for "After Cognition: Human Value in the Age of Irreducibility". Transforming from static Quarto/HTML to a modern Supabase + Next.js platform.

## Tech Stack
- **Database**: Supabase (PostgreSQL)
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Supabase Auth (existing implementation)
- **Content Source**: Quarto markdown files
- **Deployment**: Vercel (frontend), Supabase (backend)

## Project Structure
```
After_cognition/
├── parts/               # Quarto thesis chapters (source content)
├── docs/               # Rendered HTML from Quarto
├── src/                # Next.js application
│   ├── app/           # App router pages
│   ├── components/    # React components (auth exists)
│   └── lib/          # Utilities and Supabase client
├── supabase-thesis-plan/  # Complete implementation docs
├── claude-code-strategy/  # Execution strategy
└── supabase-thesis-mcp/  # Custom MCP server (to be created)
```

## Key Conventions
- **Authentication**: Already implemented in auth-wrapper.tsx and login.tsx - reuse these patterns
- **Database**: Follow schema in supabase-thesis-plan/02-DATABASE-SCHEMA.md exactly
- **Content Pipeline**: Preserve all academic formatting from Quarto
- **Design**: Follow specifications in supabase-thesis-plan/05-FRONTEND-DESIGN.md
- **MCP Tools**: Use custom MCP server for all Supabase operations

## Current State
- ✅ Quarto thesis content complete
- ✅ Basic auth components exist
- ✅ Supabase project created (axjuevxjcestqhzdgjca)
- ⏳ Database schema needs creation
- ⏳ Content pipeline needs building
- ⏳ Frontend needs implementation
- ⏳ MCP server needs creation

## Implementation Phases
1. **Infrastructure**: MCP server + database setup
2. **Content**: Parse and upload Quarto content
3. **Frontend**: Build complete reader experience
4. **Advanced**: Analytics, search, collaboration
5. **Deploy**: Production deployment

## Critical Files
- `supabase-thesis-plan/*.md` - Complete specifications
- `claude-code-strategy/*.md` - Implementation strategy
- `parts/*.qmd` - Source content
- `src/components/auth-wrapper.tsx` - Auth pattern to follow

## Environment Variables Needed
```
SUPABASE_URL=https://axjuevxjcestqhzdgjca.supabase.co
SUPABASE_ANON_KEY=[from dashboard]
SUPABASE_SERVICE_KEY=[from dashboard]
NEXT_PUBLIC_SUPABASE_URL=[same as SUPABASE_URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[same as SUPABASE_ANON_KEY]
```

## Success Criteria
- All thesis content accessible through dynamic interface
- Full-text search working
- Reading progress tracked
- Mobile responsive
- Production deployed
- < 2 second load times

## Decision Log
- Use existing auth components rather than building new
- Implement MCP server for better Claude Code integration
- Focus on MVP features first, advanced features later
- Preserve all academic formatting from Quarto

## Testing Strategy
- Test MCP tools individually first
- Verify content parsing preserves formatting
- Test auth flow end-to-end
- Check mobile responsiveness
- Validate search functionality
- Performance testing before deploy

## Common Commands
```bash
# Start MCP server
node supabase-thesis-mcp/dist/index.js

# Run content sync
npm run sync-content

# Start dev server
npm run dev

# Run tests
npm test

# Deploy
vercel --prod
```

## Notes for Claude Code
- When in doubt, read the documentation in supabase-thesis-plan/
- Use MCP tools rather than direct database access when available
- Commit after each major feature
- Test critical paths but don't over-test during rapid development
- Focus on working features over perfect code initially
