# Deployment Strategy

## 🚀 Production Architecture

### Infrastructure Overview
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Supabase       │    │   GitHub        │
│   (Frontend)    │◄──►│   (Backend)      │◄──►│   (Source)      │
│   - Next.js     │    │   - PostgreSQL   │    │   - Actions     │
│   - CDN         │    │   - Auth         │    │   - Webhooks    │
│   - Edge Fns    │    │   - Storage      │    │   - Security    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Monitoring    │
                    │   - Sentry      │
                    │   - Analytics   │
                    │   - Logs        │
                    └─────────────────┘
```

## 🏗️ Environment Configuration

### 1. Development Environment
```bash
# Local development setup
git clone https://github.com/Magnussmari/thesis-platform
cd thesis-platform

# Environment configuration
cp .env.example .env.local

# Dependencies
npm install

# Database setup
npx supabase start
npx supabase db push

# Development server
npm run dev
```

### 2. Staging Environment
```yaml
# vercel.json - Staging configuration
{
  "env": {
    "SUPABASE_URL": "@supabase-staging-url",
    "SUPABASE_ANON_KEY": "@supabase-staging-key",
    "NEXT_PUBLIC_SITE_URL": "https://thesis-staging.vercel.app"
  },
  "build": {
    "env": {
      "NODE_ENV": "staging"
    }
  }
}
```

### 3. Production Environment
```yaml
# vercel.json - Production configuration
{
  "env": {
    "SUPABASE_URL": "@supabase-production-url",
    "SUPABASE_ANON_KEY": "@supabase-production-key",
    "NEXT_PUBLIC_SITE_URL": "https://after-cognition.com"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy Thesis Platform

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type checking
        run: npm run type-check
        
      - name: Run linting
        run: npm run lint
        
      - name: Run tests
        run: npm run test
        
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_TEST_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_TEST_KEY }}

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: staging

  sync-content:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Quarto
        uses: quarto-dev/quarto-actions/setup@v2
        
      - name: Render content
        run: quarto render --to html
        
      - name: Sync to Supabase
        run: node scripts/sync-content.js
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}

  deploy-production:
    needs: [test, sync-content]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 📦 Build Optimization

### Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  
  images: {
    domains: ['axjuevxjcestqhzdgjca.supabase.co'],
    formats: ['image/avif', 'image/webp']
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  async redirects() {
    return [
      {
        source: '/thesis',
        destination: '/chapters',
        permanent: true
      }
    ]
  },
  
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      }
    }
    
    return config
  }
}

module.exports = nextConfig
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze

# Performance monitoring
npm run lighthouse
npm run web-vitals
```

## 🔒 Security Configuration

### Environment Variables
```bash
# Production secrets (GitHub Secrets)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# Optional integrations
SENTRY_DSN=https://your-sentry-dsn
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VERCEL_TOKEN=your-vercel-token

# Database backups
DATABASE_BACKUP_URL=your-backup-service
BACKUP_ENCRYPTION_KEY=your-encryption-key
```

### Security Headers
```javascript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  )
  
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

## 📊 Monitoring & Analytics

### Application Monitoring
```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  tracesSampleRate: 1.0,
  
  beforeSend(event) {
    // Filter sensitive data
    if (event.user) {
      delete event.user.email
    }
    return event
  }
})

// Performance monitoring
export const trackPerformance = (name: string, duration: number) => {
  Sentry.addBreadcrumb({
    message: `Performance: ${name}`,
    data: { duration },
    level: 'info'
  })
}
```

### Database Monitoring
```sql
-- Database performance monitoring
CREATE OR REPLACE FUNCTION log_slow_queries()
RETURNS void AS $$
BEGIN
  -- Log queries taking longer than 1 second
  IF current_setting('log_min_duration_statement')::int > 1000 THEN
    RAISE LOG 'Slow query detected';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Monitor database size
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### User Analytics
```typescript
// lib/analytics.ts
import { Analytics } from '@vercel/analytics/react'

export const trackUserEvent = (event: string, properties?: object) => {
  // Privacy-compliant analytics
  if (typeof window !== 'undefined') {
    // Use Vercel Analytics for privacy-compliant tracking
    Analytics.track(event, properties)
  }
}

// Reading analytics
export const trackReadingProgress = (chapterId: string, progress: number) => {
  trackUserEvent('reading_progress', {
    chapter: chapterId,
    progress: Math.round(progress),
    timestamp: new Date().toISOString()
  })
}
```

## 🔄 Backup & Recovery

### Database Backups
```bash
# Automated daily backups
#!/bin/bash
# scripts/backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="thesis_backup_$DATE.sql"

# Create backup
pg_dump $DATABASE_URL > backups/$BACKUP_FILE

# Encrypt backup
gpg --cipher-algo AES256 --compress-algo 1 --symmetric --output backups/$BACKUP_FILE.gpg backups/$BACKUP_FILE

# Upload to secure storage
aws s3 cp backups/$BACKUP_FILE.gpg s3://thesis-backups/

# Cleanup local files
rm backups/$BACKUP_FILE backups/$BACKUP_FILE.gpg

echo "Backup completed: $BACKUP_FILE"
```

### Recovery Procedures
```bash
# Database recovery
#!/bin/bash
# scripts/restore-database.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./restore-database.sh <backup-file>"
  exit 1
fi

# Download and decrypt backup
aws s3 cp s3://thesis-backups/$BACKUP_FILE.gpg ./
gpg --decrypt $BACKUP_FILE.gpg > $BACKUP_FILE

# Restore database
psql $DATABASE_URL < $BACKUP_FILE

echo "Database restored from: $BACKUP_FILE"
```

## 🌐 Domain & DNS Configuration

### Domain Setup
```bash
# Custom domain configuration
# 1. Purchase domain (e.g., after-cognition.com)
# 2. Configure DNS records

# A Record
@ -> 76.76.19.61 (Vercel IP)

# CNAME Records
www -> cname.vercel-dns.com
api -> cname.vercel-dns.com

# TXT Records (verification)
@ -> "vercel-verification=your-verification-code"
```

### SSL/TLS Configuration
```yaml
# Automatic SSL through Vercel
# - Free SSL certificates
# - Automatic renewal
# - HTTP/2 support
# - Edge network optimization
```

## 📈 Performance Optimization

### CDN Configuration
```javascript
// Edge functions for dynamic content
// api/edge/search.js
export const config = {
  runtime: 'edge',
  regions: ['iad1', 'fra1', 'hnd1'] // Global edge deployment
}

export default async function handler(request) {
  // Cached search results at the edge
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  
  // Fast search response from edge
  return new Response(JSON.stringify(results), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=300'
    }
  })
}
```

### Database Optimization
```sql
-- Production database optimizations
-- Connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';

-- Query optimization
CREATE INDEX CONCURRENTLY idx_sections_search_gin ON sections USING gin(search_vector);
CREATE INDEX CONCURRENTLY idx_user_progress_active ON user_progress(user_id, updated_at) WHERE completed_at IS NULL;

-- Automated maintenance
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

## 🚨 Incident Response

### Monitoring Alerts
```yaml
# Vercel monitoring configuration
{
  "alerts": [
    {
      "name": "High Error Rate",
      "condition": "error_rate > 5%",
      "notification": "email,slack"
    },
    {
      "name": "Slow Response Time",
      "condition": "p95_response_time > 2s",
      "notification": "email"
    },
    {
      "name": "Database Connection Issues",
      "condition": "database_errors > 10",
      "notification": "email,slack,sms"
    }
  ]
}
```

### Recovery Procedures
```bash
# Emergency response playbook
1. Identify the issue (monitoring alerts)
2. Check service status (Vercel, Supabase)
3. Review recent deployments
4. Rollback if necessary
5. Communicate with users
6. Implement fix
7. Post-incident review
```

---

**Next:** Review the benefits analysis in `08-BENEFITS-ANALYSIS.md`
