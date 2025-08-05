# Claude Code Master Prompts Strategy

## 🎯 The Ultra-Minimal Prompt Philosophy

Based on best practices, we'll create **3-5 MEGA PROMPTS** that can run for hours autonomously. Each prompt is designed to trigger extended thinking mode and maximize Claude Code's capabilities.

## 📋 The Master Prompts

### 🚀 PROMPT 1: Complete Infrastructure Setup (4-6 hours)
```
ultrathink hard and build the complete After Cognition thesis platform infrastructure end-to-end.

First, initialize with /init and understand the existing Quarto-based thesis structure. Read all files in supabase-thesis-plan/ to understand the complete architecture.

Then systematically:

PHASE 1 - MCP Server Creation:
- Build the complete supabase-thesis-mcp server with all tools from 01-SUPABASE-MCP-SERVER.md
- Test each tool thoroughly with mock data
- Create comprehensive error handling and logging
- Build automated tests for all MCP tools

PHASE 2 - Database Setup:
- Connect to Supabase using the MCP server
- Create all tables from 02-DATABASE-SCHEMA.md with proper indexes
- Set up Row Level Security policies
- Create database functions and triggers
- Test with sample data insertion and queries
- Verify search functionality works

PHASE 3 - Content Pipeline:
- Build the complete Quarto parser that handles all academic features
- Process the existing thesis content preserving all formatting
- Create the GitHub Actions workflow for automated sync
- Test the pipeline with actual thesis chapters
- Verify citations, cross-references, and figures are preserved

PHASE 4 - Initial Data Load:
- Parse all existing Quarto content
- Upload to Supabase maintaining structure
- Verify all chapters and sections are correctly stored
- Test search across all content
- Generate initial analytics

Create a comprehensive test suite that verifies everything works. Document all environment variables needed. 

Use auto-accept mode internally for file operations but think carefully about database operations. If you encounter any issues, debug systematically using console.log and error traces.

Commit your work with descriptive messages every major milestone.
```

### 🏗️ PROMPT 2: Complete Frontend Application (6-8 hours)
```
ultrathink harder and build the complete Next.js frontend for the After Cognition thesis reader platform.

Read the requirements from:
- 05-FRONTEND-DESIGN.md for UI/UX specifications  
- 03-IMPLEMENTATION-PHASES.md for feature requirements
- The existing auth-wrapper.tsx and login components for authentication patterns

Build the COMPLETE application including:

AUTHENTICATION FLOW:
- Adapt the existing Supabase auth (login.tsx, auth-wrapper.tsx)
- Protected routes with middleware
- User context and session management
- Magic link email templates

READER EXPERIENCE:
- Table of contents with reading progress visualization
- Chapter reader with smooth navigation
- Section-by-section progressive loading
- Automatic bookmark and progress tracking
- Reading time estimates and statistics
- Mobile-responsive design with touch gestures

SEARCH & NAVIGATION:
- Full-text search interface with filters
- Smart navigation between chapters/sections
- Breadcrumb navigation
- Cross-reference handling
- Citation preview system

UI IMPLEMENTATION:
- Use the specified design system (typography, colors, spacing)
- Implement dark mode support
- Loading states and skeletons
- Error boundaries and fallbacks
- Accessibility features (WCAG 2.1 AA)

PERFORMANCE:
- Code splitting and lazy loading
- Image optimization with Next.js Image
- Implement caching strategies
- Progressive enhancement
- Core Web Vitals optimization

Create all components with proper TypeScript types. Use Tailwind CSS for styling following the design specifications. Implement proper error handling throughout.

Test everything thoroughly including:
- Authentication flow
- Reading progress persistence
- Search functionality
- Mobile responsiveness
- Accessibility compliance

Set up the development environment with hot reload. Create Storybook stories for key components if time permits.

Commit your work incrementally with clear messages.
```

### 🔬 PROMPT 3: Advanced Features & Polish (4-6 hours)
```
think harder and implement all advanced features and production polish for the thesis platform.

Review what's been built and add:

ADVANCED READING FEATURES:
- Smart bookmarking with annotations
- Highlighting and note-taking system
- Reading analytics dashboard
- Personal reading goals and achievements
- Export reading progress reports

ACADEMIC ENHANCEMENTS:
- Interactive citations with hover previews
- Citation network visualization
- Figure galleries with zoom
- Footnote management system
- Bibliography page with filters

COLLABORATION FEATURES:
- Comment system with threading
- Public/private annotations
- Share reading progress
- Discussion threads per section

ANALYTICS & MONITORING:
- Implement comprehensive analytics tracking
- Reading pattern analysis
- Performance monitoring with Sentry
- User behavior insights
- Admin dashboard for metrics

PRODUCTION OPTIMIZATION:
- Set up Vercel deployment configuration
- Configure CDN and edge functions
- Implement security headers
- Set up monitoring and alerting
- Create backup strategies

PWA FEATURES:
- Offline reading capability
- Service worker for caching
- Add to home screen
- Push notifications for updates

API DEVELOPMENT:
- RESTful API for content access
- GraphQL endpoint for complex queries
- Webhook system for integrations
- Rate limiting and API keys

TESTING & QUALITY:
- E2E tests with Playwright
- Unit tests for critical functions
- Performance testing
- Accessibility audits
- Security scanning

DOCUMENTATION:
- Complete README with setup instructions
- API documentation
- User guide for readers
- Admin guide for content management

Ensure everything integrates smoothly. Run comprehensive tests. Optimize for production performance.

Create a deployment checklist and verify all systems are go for launch.
```

### 🚢 PROMPT 4: Production Deployment (2-3 hours)
```
think and execute complete production deployment of the After Cognition thesis platform.

Deploy everything to production:

ENVIRONMENT SETUP:
- Configure all production environment variables
- Set up Vercel project with proper settings
- Configure custom domain (if available)
- Set up SSL certificates

DATABASE PRODUCTION:
- Switch Supabase to production mode
- Run final migrations
- Set up automated backups
- Configure monitoring

DEPLOYMENT PIPELINE:
- Push to GitHub main branch
- Trigger GitHub Actions workflow
- Verify content sync to production
- Deploy frontend to Vercel

TESTING & VERIFICATION:
- Run smoke tests on production
- Verify all features work
- Check performance metrics
- Test on multiple devices

MONITORING SETUP:
- Configure Sentry error tracking
- Set up uptime monitoring
- Configure alerts
- Analytics verification

LAUNCH CHECKLIST:
- SEO meta tags
- Social sharing cards
- Robots.txt and sitemap
- Performance audit
- Security audit
- Accessibility audit

Create a post-deployment report with:
- Deployment URLs
- Performance metrics
- Lighthouse scores
- Any issues found
- Recommendations for improvement

Document the entire deployment process for future reference.
```

### 🔧 PROMPT 5: Continuous Improvement (Optional, 2-3 hours)
```
think and analyze the deployed platform to implement continuous improvements and maintenance procedures.

Set up ongoing maintenance:

AUTOMATED TESTING:
- Daily automated tests via GitHub Actions
- Performance regression detection
- Broken link checking
- Security vulnerability scanning

CONTENT AUTOMATION:
- Automated content updates from Quarto
- Version control for content changes
- Automated changelog generation
- Content preview environments

USER FEEDBACK SYSTEM:
- Feedback widget implementation
- User survey system
- Analytics-based improvements
- A/B testing framework

PERFORMANCE OPTIMIZATION:
- Implement advanced caching strategies
- Database query optimization
- Bundle size reduction
- Image optimization pipeline

BACKUP & DISASTER RECOVERY:
- Automated daily backups
- Disaster recovery procedures
- Data export functionality
- Rollback mechanisms

SCALING PREPARATION:
- Load testing
- Database optimization for scale
- CDN configuration optimization
- Multi-region deployment setup

Create maintenance documentation including:
- Daily/weekly/monthly task checklists
- Troubleshooting guides
- Performance optimization guides
- Emergency response procedures

Set up a dashboard showing system health and key metrics.
```

## 🎮 Execution Strategy

### Optimal Claude Code Settings

```bash
# Launch Claude Code with maximum capabilities
claude --dangerously-skip-permissions --mcp-debug

# For long-running operations
claude --max-tokens 200000 --timeout 3600

# Enable auto-accept for specific phases
# Shift+Tab to toggle through modes:
# - Normal mode (for initial planning)
# - Auto-accept edit (for implementation)
# - Plan mode (for complex features)
```

### Prompt Optimization Techniques

1. **Trigger Extended Thinking**:
   - Use "ultrathink" for maximum reasoning
   - Use "think harder" for complex problems
   - Use "think hard" for medium complexity
   - Use "think" for standard operations

2. **Context Management**:
   - Use `/init` at the start of each major phase
   - Use `/compact` between major sections
   - Use `/clear` when switching contexts completely

3. **File References**:
   - Use tab completion for file paths
   - Reference specific documentation files
   - Include mockups/screenshots when available

4. **Autonomous Execution**:
   - Enable auto-accept mode for repetitive tasks
   - Use plan mode for architectural decisions
   - Switch to normal mode for review points

### Session Management

```bash
# Create command shortcuts in .claude/commands/

# .claude/commands/build-thesis.md
Build the complete After Cognition thesis platform following the implementation plan in claude-code-strategy/.
Read all documentation files first, then execute Phase $ARGUMENTS.

# .claude/commands/test-all.md
Run comprehensive tests on the thesis platform including:
- Unit tests
- Integration tests  
- E2E tests
- Performance tests
- Accessibility tests
Report results with specific metrics.

# .claude/commands/deploy.md
Deploy the thesis platform to $ARGUMENTS environment.
Run pre-deployment checks, deploy, then run post-deployment verification.
```

## 📊 Success Metrics

### Phase Completion Indicators

**Infrastructure (Prompt 1)**:
- ✅ MCP server running and tested
- ✅ All database tables created
- ✅ Content pipeline functional
- ✅ Sample data loaded

**Frontend (Prompt 2)**:
- ✅ Authentication working
- ✅ All pages rendering
- ✅ Search functional
- ✅ Progress tracking active

**Advanced Features (Prompt 3)**:
- ✅ Analytics dashboard live
- ✅ All advanced features working
- ✅ Tests passing
- ✅ Documentation complete

**Deployment (Prompt 4)**:
- ✅ Production site live
- ✅ All features verified
- ✅ Monitoring active
- ✅ Performance optimized

## 🚨 Troubleshooting

### Common Issues and Solutions

1. **MCP Connection Issues**:
   ```bash
   claude --mcp-debug
   # Check server logs
   # Verify environment variables
   ```

2. **Long-Running Operations**:
   ```bash
   # Use nohup for very long operations
   nohup claude -p "your prompt" > output.log 2>&1 &
   ```

3. **Memory Issues**:
   ```bash
   # Use /compact more frequently
   # Clear unnecessary context
   # Break into smaller operations
   ```

4. **Database Conflicts**:
   ```bash
   # Use transactions
   # Implement proper rollback
   # Test on development branch first
   ```

## 🎯 The Magic Formula

**Less Prompts + More Thinking + Full Autonomy = Maximum Impact**

By using these 4-5 mega prompts with Claude Code's maximum capabilities, you can build the entire thesis platform with minimal human intervention, letting Claude Code work for hours to deliver a production-ready system.

Remember: Trust the process, let Claude Code think deeply, and intervene only when absolutely necessary!
