# Supabase MCP Server for After Cognition

## 🎯 Overview
Create a custom MCP server that gives Claude Code direct access to Supabase, enabling autonomous database operations, content management, and deployment workflows.

## 📦 MCP Server Implementation

### Core Structure
```typescript
// supabase-thesis-mcp/src/index.ts
import { Server } from '@modelcontextprotocol/sdk';
import { createClient } from '@supabase/supabase-js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/node';

class SupabaseThesisMCP {
  private supabase: any;
  private server: Server;

  constructor() {
    this.server = new Server({
      name: 'supabase-thesis',
      version: '1.0.0',
      description: 'MCP server for After Cognition thesis platform'
    });

    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    this.registerTools();
  }

  private registerTools() {
    // Database Operations
    this.server.addTool({
      name: 'create_tables',
      description: 'Create all database tables from schema',
      parameters: {
        type: 'object',
        properties: {
          dropExisting: { type: 'boolean', default: false }
        }
      },
      handler: this.createTables.bind(this)
    });

    this.server.addTool({
      name: 'sync_content',
      description: 'Parse and upload Quarto content to database',
      parameters: {
        type: 'object',
        properties: {
          contentPath: { type: 'string' },
          chapterFilter: { type: 'string', optional: true }
        }
      },
      handler: this.syncContent.bind(this)
    });

    this.server.addTool({
      name: 'query_content',
      description: 'Query thesis content with GROQ-like syntax',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          limit: { type: 'number', default: 10 }
        }
      },
      handler: this.queryContent.bind(this)
    });

    // User Management
    this.server.addTool({
      name: 'create_test_users',
      description: 'Create test users with various progress levels',
      parameters: {
        type: 'object',
        properties: {
          count: { type: 'number', default: 5 }
        }
      },
      handler: this.createTestUsers.bind(this)
    });

    // Analytics
    this.server.addTool({
      name: 'get_analytics',
      description: 'Get reading analytics and engagement metrics',
      parameters: {
        type: 'object',
        properties: {
          metric: { type: 'string' },
          timeRange: { type: 'string', default: '7d' }
        }
      },
      handler: this.getAnalytics.bind(this)
    });

    // Deployment
    this.server.addTool({
      name: 'deploy_to_vercel',
      description: 'Deploy frontend to Vercel',
      parameters: {
        type: 'object',
        properties: {
          environment: { type: 'string', default: 'preview' }
        }
      },
      handler: this.deployToVercel.bind(this)
    });

    // Content Pipeline
    this.server.addTool({
      name: 'parse_quarto',
      description: 'Parse Quarto HTML and extract structured content',
      parameters: {
        type: 'object',
        properties: {
          htmlPath: { type: 'string' }
        }
      },
      handler: this.parseQuarto.bind(this)
    });

    // Search Operations
    this.server.addTool({
      name: 'setup_search',
      description: 'Configure full-text search indexes',
      handler: this.setupSearch.bind(this)
    });

    // Migration Management
    this.server.addTool({
      name: 'run_migrations',
      description: 'Run database migrations',
      parameters: {
        type: 'object',
        properties: {
          version: { type: 'string', optional: true }
        }
      },
      handler: this.runMigrations.bind(this)
    });

    // Development Tools
    this.server.addTool({
      name: 'seed_database',
      description: 'Seed database with sample data',
      handler: this.seedDatabase.bind(this)
    });

    this.server.addTool({
      name: 'check_health',
      description: 'Check system health and connections',
      handler: this.checkHealth.bind(this)
    });

    // Backup & Recovery
    this.server.addTool({
      name: 'backup_database',
      description: 'Create database backup',
      handler: this.backupDatabase.bind(this)
    });

    this.server.addTool({
      name: 'restore_database',
      description: 'Restore from backup',
      parameters: {
        type: 'object',
        properties: {
          backupId: { type: 'string' }
        }
      },
      handler: this.restoreDatabase.bind(this)
    });
  }

  // Tool implementations
  private async createTables({ dropExisting }: any) {
    const schema = await this.loadSchema();
    
    if (dropExisting) {
      await this.dropAllTables();
    }

    for (const table of schema.tables) {
      await this.supabase.rpc('execute_sql', {
        query: table.createStatement
      });
    }

    return { success: true, tablesCreated: schema.tables.length };
  }

  private async syncContent({ contentPath, chapterFilter }: any) {
    const parser = new QuartoParser();
    const content = await parser.parseDirectory(contentPath);
    
    let chapters = content.chapters;
    if (chapterFilter) {
      chapters = chapters.filter(c => c.slug.includes(chapterFilter));
    }

    for (const chapter of chapters) {
      const { data: chapterData } = await this.supabase
        .from('chapters')
        .upsert(chapter, { onConflict: 'slug' })
        .select()
        .single();

      for (const section of chapter.sections) {
        await this.supabase
          .from('sections')
          .upsert({
            ...section,
            chapter_id: chapterData.id
          }, { onConflict: 'chapter_id,slug' });
      }
    }

    return { 
      success: true, 
      chaptersProcessed: chapters.length,
      sectionsProcessed: chapters.reduce((acc, c) => acc + c.sections.length, 0)
    };
  }

  // ... more implementations
}

// Launch server
const server = new SupabaseThesisMCP();
const transport = new StdioServerTransport();
server.connect(transport);
```

### Package Configuration
```json
// package.json
{
  "name": "@after-cognition/supabase-mcp",
  "version": "1.0.0",
  "description": "MCP server for After Cognition thesis platform",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "cheerio": "^1.0.0",
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
```

## 🔧 Claude Code Configuration

### .mcp.json (Project Level)
```json
{
  "mcpServers": {
    "supabase-thesis": {
      "command": "node",
      "args": ["./supabase-thesis-mcp/dist/index.js"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_SERVICE_KEY": "${SUPABASE_SERVICE_KEY}",
        "VERCEL_TOKEN": "${VERCEL_TOKEN}",
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y", 
        "@modelcontextprotocol/server-filesystem",
        "/Users/magnussmari/Documents/VALOR/Review_copies/After_cognition"
      ]
    }
  }
}
```

### Environment Setup
```bash
# .env.local
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key
VERCEL_TOKEN=your-vercel-token
GITHUB_TOKEN=your-github-token
DATABASE_URL=postgresql://...
```

## 🚀 Installation Steps

### 1. Create MCP Server
```bash
# In project root
mkdir supabase-thesis-mcp
cd supabase-thesis-mcp
npm init -y
npm install @modelcontextprotocol/sdk @supabase/supabase-js cheerio gray-matter
npm install -D typescript @types/node tsx

# Create TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF

# Build
npm run build
```

### 2. Configure Claude Code
```bash
# Add to project .mcp.json
echo '{...}' > .mcp.json

# Initialize Claude Code
cd /Users/magnussmari/Documents/VALOR/Review_copies/After_cognition
claude --init

# Test MCP connection
claude --mcp-debug
```

### 3. Test Tools
```bash
# In Claude Code
"Test our MCP server - check health status"
"Create all database tables from our schema"
"Sync the prologue chapter to the database"
"Query for all published sections"
```

## 📋 Available MCP Tools

### Database Management
- `create_tables` - Create schema from definitions
- `drop_tables` - Drop all tables (careful!)
- `run_migrations` - Execute migration files
- `backup_database` - Create backup
- `restore_database` - Restore from backup

### Content Operations
- `sync_content` - Parse and upload Quarto content
- `parse_quarto` - Parse HTML without uploading
- `update_section` - Update specific section
- `publish_chapter` - Mark chapter as published
- `unpublish_chapter` - Unpublish chapter

### User Management
- `create_test_users` - Generate test users
- `create_user` - Create specific user
- `update_user_progress` - Update reading progress
- `get_user_stats` - Get user statistics

### Analytics
- `get_analytics` - Reading analytics
- `get_popular_sections` - Most-read content
- `get_reading_patterns` - User behavior analysis
- `export_analytics` - Export data

### Search
- `setup_search` - Configure search indexes
- `search_content` - Full-text search
- `rebuild_search_index` - Rebuild indexes

### Deployment
- `deploy_to_vercel` - Deploy frontend
- `check_deployment_status` - Check status
- `rollback_deployment` - Rollback to previous

### Development
- `seed_database` - Add sample data
- `clear_database` - Clear all data
- `check_health` - System health check
- `run_tests` - Execute test suite

## 🎯 Why This Approach?

1. **Direct Database Access**: Claude Code can manipulate the database directly without manual SQL
2. **Automated Workflows**: Complex multi-step operations in single commands
3. **Error Recovery**: Built-in error handling and rollback capabilities
4. **Progress Tracking**: Real-time feedback on long-running operations
5. **Safety Features**: Confirmation prompts for destructive operations
6. **Extensibility**: Easy to add new tools as needed

## 🔐 Security Considerations

1. **Read-Only Mode**: Default to read-only for safety
2. **Project Scoping**: Limit to specific project
3. **Branch Protection**: Use development branches
4. **Audit Logging**: Track all operations
5. **Confirmation Required**: Destructive operations need confirmation

## 📝 Usage Examples

```bash
# Initial setup
"Initialize the thesis platform database with all tables and indexes"

# Content management
"Parse all Quarto chapters and sync them to Supabase, show me progress"

# Testing
"Create 10 test users with varied reading progress and generate analytics"

# Deployment
"Deploy the current build to Vercel staging and run smoke tests"

# Maintenance
"Backup the database, run migrations, and verify system health"
```

This MCP server becomes Claude Code's direct interface to your entire thesis platform infrastructure!
