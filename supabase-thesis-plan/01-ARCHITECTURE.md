# Technical Architecture

## 🏗️ System Overview

### High-Level Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Quarto        │    │   GitHub         │    │   Supabase      │
│   (Authoring)   │───▶│   (Pipeline)     │───▶│   (Database)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Next.js       │
                       │   (Frontend)    │
                       └─────────────────┘
```

### Component Breakdown

#### 1. **Content Layer (Quarto)**
- **Purpose:** Academic writing environment
- **Technology:** Quarto, Markdown, LaTeX
- **Output:** Structured HTML with academic formatting
- **Workflow:** Author → Write → Render → Commit

#### 2. **Pipeline Layer (GitHub Actions)**
- **Purpose:** Automated content processing
- **Technology:** Node.js, GitHub Actions, HTML parsing
- **Process:** Parse Quarto HTML → Extract structure → Upload to Supabase
- **Triggers:** Push to main branch, manual dispatch

#### 3. **Database Layer (Supabase)**
- **Purpose:** Content storage and user management
- **Technology:** PostgreSQL, Row Level Security, Real-time
- **Features:** Content versioning, user analytics, full-text search
- **Security:** JWT authentication, role-based access

#### 4. **Presentation Layer (Next.js)**
- **Purpose:** Modern reading interface
- **Technology:** React, TypeScript, Tailwind CSS
- **Features:** Progressive loading, search, progress tracking
- **Hosting:** Vercel with edge functions

## 🔄 Data Flow

### Content Publishing Flow
1. **Author writes in Quarto** (existing workflow preserved)
2. **Quarto renders to HTML** (`quarto render --to html`)
3. **GitHub Actions triggered** on push to main
4. **Content parser extracts** chapters, sections, metadata
5. **Database updated** with new/modified content
6. **Frontend automatically reflects** changes via real-time sync

### Reader Experience Flow
1. **User visits site** (modern, fast-loading interface)
2. **Authentication required** (existing Supabase auth)
3. **Progressive content loading** (chapters loaded on demand)
4. **Reading progress tracked** (automatic bookmark/resume)
5. **Search across content** (full-text search capability)

## 🔧 Technology Stack

### Core Technologies
- **Database:** PostgreSQL (via Supabase)
- **Backend:** Supabase (Auth, Database, Real-time, Storage)
- **Frontend:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS with custom academic theme
- **Deployment:** Vercel (Frontend), Supabase (Backend)

### Development Tools
- **Content Processing:** Cheerio (HTML parsing), Gray-matter (metadata)
- **Search:** PostgreSQL full-text search with tsvector
- **Analytics:** Supabase analytics + custom tracking
- **CI/CD:** GitHub Actions for automated deployment

### Academic Integrations
- **Citations:** Preserve Quarto's citation processing
- **Cross-references:** Maintain academic link structure
- **Figures/Tables:** Asset management via Supabase Storage
- **Bibliography:** Structured reference storage and display

## 🔒 Security Architecture

### Authentication & Authorization
- **User Auth:** Supabase Auth (magic links, OAuth)
- **Access Control:** Row Level Security policies
- **Content Protection:** Chapter-level access permissions
- **API Security:** JWT tokens, rate limiting

### Data Protection
- **Encryption:** TLS in transit, encrypted at rest
- **Backup:** Automated daily backups
- **Privacy:** GDPR-compliant user data handling
- **Audit:** User activity logging for analytics

## 📈 Scalability Considerations

### Performance Optimization
- **Content Delivery:** Edge caching for static assets
- **Database:** Indexed search, efficient queries
- **Frontend:** Code splitting, lazy loading, image optimization
- **Real-time:** Selective subscriptions for active readers

### Future Growth
- **Multi-thesis Support:** Extend schema for multiple works
- **Collaborative Features:** Real-time editing, comments
- **API Access:** Public API for other researchers
- **Internationalization:** Multi-language content support

## 🔍 Monitoring & Analytics

### System Monitoring
- **Uptime:** Vercel and Supabase status monitoring
- **Performance:** Core Web Vitals, database query performance
- **Errors:** Real-time error tracking and alerting
- **Usage:** Reader analytics, popular sections, engagement metrics

### Academic Insights
- **Reading Patterns:** Most/least read sections
- **Engagement:** Time spent per chapter, completion rates
- **Geographic:** Reader distribution and access patterns
- **Device:** Mobile vs desktop reading preferences

---

**Next:** Review database schema design in `02-DATABASE-SCHEMA.md`
