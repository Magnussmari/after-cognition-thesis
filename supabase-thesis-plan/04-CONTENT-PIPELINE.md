# Content Pipeline: Quarto → Supabase

## 🔄 Automated Workflow Overview

The content pipeline automatically syncs your Quarto thesis with the Supabase database, preserving academic formatting while enabling dynamic features.

```
Quarto Source → GitHub Push → Actions Trigger → Parse & Upload → Database Update → Frontend Refresh
```

## 📝 Pipeline Architecture

### 1. **Source Management**
- **Input:** Quarto markdown files (existing workflow)
- **Trigger:** Git push to main branch
- **Processing:** GitHub Actions workflow
- **Output:** Structured content in Supabase

### 2. **Content Transformation**
```
.qmd files → Quarto Render → HTML → Content Parser → Database Records
```

## 🛠️ Implementation Components

### GitHub Actions Workflow
```yaml
# .github/workflows/sync-content.yml
name: Sync Thesis Content

on:
  push:
    branches: [main]
    paths: ['parts/**', 'index.qmd', '_quarto.yml']
  workflow_dispatch:

jobs:
  sync-content:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Quarto
        uses: quarto-dev/quarto-actions/setup@v2
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Render Quarto to HTML
        run: quarto render --to html
        
      - name: Parse and Upload Content
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
        run: node scripts/sync-content.js
        
      - name: Trigger Frontend Deployment
        run: |
          curl -X POST ${{ secrets.VERCEL_DEPLOY_HOOK }}
```

### Content Parser Script
```javascript
// scripts/sync-content.js
import { createClient } from '@supabase/supabase-js'
import { load } from 'cheerio'
import fs from 'fs/promises'
import path from 'path'

class ContentSyncer {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )
  }

  async syncContent() {
    try {
      console.log('🚀 Starting content sync...')
      
      // Parse rendered HTML
      const htmlContent = await this.loadQuartoOutput()
      const parsedContent = await this.parseContent(htmlContent)
      
      // Update database
      await this.updateDatabase(parsedContent)
      
      console.log('✅ Content sync completed successfully')
    } catch (error) {
      console.error('❌ Content sync failed:', error)
      process.exit(1)
    }
  }

  async loadQuartoOutput() {
    const indexPath = path.join(process.cwd(), 'docs/index.html')
    return await fs.readFile(indexPath, 'utf-8')
  }

  async parseContent(html) {
    const $ = load(html)
    const chapters = []
    
    // Extract chapters from Quarto structure
    $('.chapter').each((i, element) => {
      const chapter = this.parseChapter($, element)
      chapters.push(chapter)
    })
    
    return { chapters }
  }

  parseChapter($, element) {
    const $chapter = $(element)
    const title = $chapter.find('h1').first().text().trim()
    const slug = this.generateSlug(title)
    
    const sections = []
    $chapter.find('.section').each((i, sectionEl) => {
      const section = this.parseSection($, sectionEl, i)
      sections.push(section)
    })
    
    return {
      title,
      slug,
      order_index: parseInt($chapter.data('chapter-number')) || 0,
      sections
    }
  }

  parseSection($, element, index) {
    const $section = $(element)
    const title = $section.find('h2, h3, h4').first().text().trim()
    const content = $section.html()
    const contentPlain = $section.text().trim()
    
    return {
      title,
      slug: this.generateSlug(title),
      content,
      content_plain: contentPlain,
      order_index: index,
      word_count: this.countWords(contentPlain),
      reading_time_minutes: this.calculateReadingTime(contentPlain)
    }
  }

  async updateDatabase({ chapters }) {
    for (const chapterData of chapters) {
      await this.upsertChapter(chapterData)
    }
  }

  async upsertChapter(chapterData) {
    const { sections, ...chapter } = chapterData
    
    // Upsert chapter
    const { data: chapterRecord, error: chapterError } = await this.supabase
      .from('chapters')
      .upsert(chapter, { 
        onConflict: 'slug',
        ignoreDuplicates: false 
      })
      .select()
      .single()
    
    if (chapterError) throw chapterError
    
    // Update sections
    for (const sectionData of sections) {
      await this.upsertSection({
        ...sectionData,
        chapter_id: chapterRecord.id
      })
    }
  }

  async upsertSection(sectionData) {
    const { error } = await this.supabase
      .from('sections')
      .upsert(sectionData, {
        onConflict: 'chapter_id,slug',
        ignoreDuplicates: false
      })
    
    if (error) throw error
  }

  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  countWords(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length
  }

  calculateReadingTime(text) {
    const wordsPerMinute = 200
    const wordCount = this.countWords(text)
    return Math.ceil(wordCount / wordsPerMinute)
  }
}

// Execute sync
const syncer = new ContentSyncer()
await syncer.syncContent()
```

## 📋 Content Mapping Strategy

### Quarto Structure → Database Schema

#### Chapter Mapping
```javascript
// Quarto chapter structure
{
  file: "parts/01-prologue.qmd",
  frontmatter: {
    title: "Prologue: The Irreducibility Moment",
    description: "An introduction to the central thesis"
  }
}

// Maps to database record
{
  title: "Prologue: The Irreducibility Moment",
  slug: "prologue-the-irreducibility-moment",
  description: "An introduction to the central thesis",
  order_index: 1,
  is_published: true
}
```

#### Section Processing
```javascript
// HTML section extraction
<div class="section level2" id="the-paradox-emerges">
  <h2>The Paradox Emerges</h2>
  <p>Content here...</p>
  <div class="callout-note">
    <p>Note content...</p>
  </div>
</div>

// Processed for database
{
  title: "The Paradox Emerges",
  slug: "the-paradox-emerges",
  content: "<h2>The Paradox Emerges</h2><p>Content here...</p>...",
  content_plain: "The Paradox Emerges Content here... Note content...",
  word_count: 150,
  reading_time_minutes: 1
}
```

### Academic Feature Preservation

#### Citations
```javascript
// Preserve Quarto citation format
<span class="citation" data-cites="smith2023">
  (<a href="#ref-smith2023" role="doc-biblioref">Smith 2023</a>)
</span>

// Enhanced with hover functionality
<span class="citation interactive" data-citation-key="smith2023">
  (Smith 2023)
</span>
```

#### Cross-references
```javascript
// Quarto cross-reference
<a href="#sec-methodology">Section 2.1</a>

// Enhanced with navigation
<a href="/chapter/methodology#sec-methodology" class="cross-ref">
  Section 2.1
</a>
```

#### Figures and Tables
```javascript
// Extract figure metadata
{
  figure_number: "1.1",
  title: "The Three Domains of Cognition",
  file_path: "graphics/cognition-diagram.svg",
  caption: "Illustrating the relationship between...",
  alt_text: "Diagram showing three interconnected circles..."
}
```

## 🔄 Incremental Updates

### Change Detection
```javascript
// Track content changes
class ChangeTracker {
  async detectChanges(newContent, existingContent) {
    const changes = {
      added: [],
      modified: [],
      deleted: []
    }
    
    // Compare content hashes
    // Identify what needs updating
    // Return change summary
    
    return changes
  }
}
```

### Version Management
```javascript
// Store content versions
async function createContentVersion(sectionId, content, changeSummary) {
  const { data } = await supabase
    .from('content_versions')
    .insert({
      section_id: sectionId,
      content,
      change_summary: changeSummary,
      version_number: await getNextVersionNumber(sectionId)
    })
  
  return data
}
```

## 🚨 Error Handling & Recovery

### Robust Error Management
```javascript
class SyncErrorHandler {
  async handleError(error, context) {
    console.error(`Sync error in ${context}:`, error)
    
    // Send notification
    await this.notifyError(error, context)
    
    // Attempt recovery
    if (this.isRecoverable(error)) {
      return await this.attemptRecovery(context)
    }
    
    throw error
  }
  
  async notifyError(error, context) {
    // Send Slack/email notification
    // Log to monitoring system
    // Update status dashboard
  }
}
```

### Rollback Capability
```javascript
async function rollbackToVersion(sectionId, versionNumber) {
  const { data: version } = await supabase
    .from('content_versions')
    .select('content')
    .eq('section_id', sectionId)
    .eq('version_number', versionNumber)
    .single()
  
  if (version) {
    await supabase
      .from('sections')
      .update({ content: version.content })
      .eq('id', sectionId)
  }
}
```

## 📊 Pipeline Monitoring

### Sync Analytics
```javascript
// Track sync performance
const syncMetrics = {
  startTime: Date.now(),
  chaptersProcessed: 0,
  sectionsUpdated: 0,
  errors: [],
  warnings: []
}

// Log to analytics
await logSyncCompletion(syncMetrics)
```

### Status Dashboard
- Real-time sync status
- Last update timestamp
- Content change summary
- Error logs and alerts
- Performance metrics

## 🔧 Development & Testing

### Local Development Setup
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your Supabase credentials

# Test content sync locally
npm run sync-content:dev

# Watch for changes
npm run sync-content:watch
```

### Testing Strategy
```javascript
// Test content parsing
describe('Content Parser', () => {
  test('extracts chapters correctly', () => {
    // Test chapter extraction logic
  })
  
  test('preserves academic formatting', () => {
    // Test formatting preservation
  })
  
  test('handles malformed HTML gracefully', () => {
    // Test error handling
  })
})
```

## 🚀 Deployment Configuration

### Environment Variables
```bash
# GitHub Secrets
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/...

# Optional: Monitoring
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
SENTRY_DSN=https://your-sentry-dsn
```

### Package Dependencies
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.0.0",
    "cheerio": "^1.0.0-rc.12",
    "gray-matter": "^4.0.3",
    "turndown": "^7.1.2"
  },
  "scripts": {
    "sync-content": "node scripts/sync-content.js",
    "sync-content:dev": "node scripts/sync-content.js --dev",
    "sync-content:watch": "nodemon scripts/sync-content.js"
  }
}
```

---

**Next:** Review frontend design specifications in `05-FRONTEND-DESIGN.md`
