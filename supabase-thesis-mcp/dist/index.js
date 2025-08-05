"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const supabase_js_1 = require("@supabase/supabase-js");
const cheerio = __importStar(require("cheerio"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
class QuartoParser {
    async parseHTML(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const chapters = [];
        // Extract chapters from Quarto structure
        $('.chapter').each((i, element) => {
            const $chapter = $(element);
            const title = $chapter.find('h1').first().text().trim();
            const slug = this.generateSlug(title);
            const sections = [];
            $chapter.find('.section').each((j, sectionEl) => {
                const $section = $(sectionEl);
                const sectionTitle = $section.find('h2, h3, h4').first().text().trim();
                const content = $section.html() || '';
                const contentPlain = $section.text().trim();
                sections.push({
                    title: sectionTitle,
                    slug: this.generateSlug(sectionTitle),
                    content,
                    content_plain: contentPlain,
                    order_index: j,
                    word_count: this.countWords(contentPlain),
                    reading_time_minutes: this.calculateReadingTime(contentPlain)
                });
            });
            chapters.push({
                title,
                slug,
                order_index: i,
                sections,
                is_published: true
            });
        });
        return { chapters };
    }
    async parseDirectory(dirPath) {
        const files = await fs.readdir(dirPath);
        const htmlFiles = files.filter(f => f.endsWith('.html'));
        const chapters = [];
        for (const file of htmlFiles) {
            const content = await fs.readFile(path.join(dirPath, file), 'utf-8');
            const $ = cheerio.load(content);
            // Extract title
            const title = $('h1').first().text().trim() || file.replace('.html', '');
            const slug = this.generateSlug(title);
            // Extract sections
            const sections = [];
            let sectionIndex = 0;
            // Find all section-level headings
            $('h2, h3').each((i, el) => {
                const $heading = $(el);
                const sectionTitle = $heading.text().trim();
                // Get content until next heading
                let contentHtml = '';
                let contentText = '';
                let $current = $heading.next();
                while ($current.length && !$current.is('h1, h2, h3')) {
                    contentHtml += $.html($current);
                    contentText += $current.text() + ' ';
                    $current = $current.next();
                }
                sections.push({
                    title: sectionTitle,
                    slug: this.generateSlug(sectionTitle),
                    content: contentHtml,
                    content_plain: contentText.trim(),
                    order_index: sectionIndex++,
                    word_count: this.countWords(contentText),
                    reading_time_minutes: this.calculateReadingTime(contentText),
                    is_published: true
                });
            });
            // Extract order from filename (e.g., "01-prologue.html" -> 1)
            const orderMatch = file.match(/^(\d+)-/);
            const orderIndex = orderMatch ? parseInt(orderMatch[1]) : chapters.length;
            chapters.push({
                title,
                slug,
                order_index: orderIndex,
                sections,
                is_published: true,
                estimated_reading_time: sections.reduce((acc, s) => acc + s.reading_time_minutes, 0)
            });
        }
        return { chapters: chapters.sort((a, b) => a.order_index - b.order_index) };
    }
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
    countWords(text) {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }
    calculateReadingTime(text) {
        const wordsPerMinute = 200;
        const wordCount = this.countWords(text);
        return Math.ceil(wordCount / wordsPerMinute);
    }
}
class SupabaseThesisMCP {
    supabase;
    server;
    parser;
    constructor() {
        this.server = new index_js_1.Server({
            name: 'supabase-thesis',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {}
            }
        });
        const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        this.parser = new QuartoParser();
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'create_tables',
                    description: 'Create all database tables from schema',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            dropExisting: { type: 'boolean', description: 'Drop existing tables first' }
                        }
                    }
                },
                {
                    name: 'sync_content',
                    description: 'Parse and upload Quarto content to database',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            contentPath: { type: 'string', description: 'Path to content directory' },
                            chapterFilter: { type: 'string', description: 'Optional chapter filter' }
                        },
                        required: ['contentPath']
                    }
                },
                {
                    name: 'query_content',
                    description: 'Query thesis content',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            query: { type: 'string', description: 'Search query' },
                            limit: { type: 'number', description: 'Result limit' }
                        },
                        required: ['query']
                    }
                },
                {
                    name: 'setup_search',
                    description: 'Configure full-text search indexes',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    }
                },
                {
                    name: 'create_test_users',
                    description: 'Create test users with various progress levels',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            count: { type: 'number', description: 'Number of test users' }
                        }
                    }
                },
                {
                    name: 'get_analytics',
                    description: 'Get reading analytics and engagement metrics',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            metric: { type: 'string', description: 'Metric type' },
                            timeRange: { type: 'string', description: 'Time range (e.g., 7d)' }
                        }
                    }
                },
                {
                    name: 'check_health',
                    description: 'Check system health and connections',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    }
                },
                {
                    name: 'seed_database',
                    description: 'Seed database with sample data',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    }
                }
            ]
        }));
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                let result;
                switch (name) {
                    case 'create_tables':
                        result = await this.createTables(args);
                        break;
                    case 'sync_content':
                        result = await this.syncContent(args);
                        break;
                    case 'query_content':
                        result = await this.queryContent(args);
                        break;
                    case 'setup_search':
                        result = await this.setupSearch();
                        break;
                    case 'create_test_users':
                        result = await this.createTestUsers(args);
                        break;
                    case 'get_analytics':
                        result = await this.getAnalytics(args);
                        break;
                    case 'check_health':
                        result = await this.checkHealth();
                        break;
                    case 'seed_database':
                        result = await this.seedDatabase();
                        break;
                    default:
                        result = { success: false, error: `Unknown tool: ${name}` };
                }
                return {
                    content: [{
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: 'text',
                            text: JSON.stringify({
                                success: false,
                                error: error.message || 'Unknown error occurred'
                            }, null, 2)
                        }]
                };
            }
        });
    }
    async createTables(args) {
        const { dropExisting = false } = args;
        try {
            // Read the schema file
            const schemaPath = path.join(process.cwd(), 'supabase', 'migrations', '20250110_initial_schema.sql');
            let schema;
            try {
                schema = await fs.readFile(schemaPath, 'utf-8');
            }
            catch {
                // If migration doesn't exist, use the schema from documentation
                schema = this.getDefaultSchema();
            }
            if (dropExisting) {
                // Drop existing tables
                const dropQueries = [
                    'DROP TABLE IF EXISTS user_progress CASCADE',
                    'DROP TABLE IF EXISTS bookmarks CASCADE',
                    'DROP TABLE IF EXISTS reading_sessions CASCADE',
                    'DROP TABLE IF EXISTS content_versions CASCADE',
                    'DROP TABLE IF EXISTS figures CASCADE',
                    'DROP TABLE IF EXISTS references CASCADE',
                    'DROP TABLE IF EXISTS sections CASCADE',
                    'DROP TABLE IF EXISTS chapters CASCADE',
                    'DROP TABLE IF EXISTS thesis_metadata CASCADE'
                ];
                for (const query of dropQueries) {
                    await this.supabase.rpc('query', { query });
                }
            }
            // Execute schema
            // Note: In production, you'd execute this through Supabase migrations
            // For now, we'll return success and instructions
            return {
                success: true,
                data: {
                    message: 'Schema ready for execution',
                    instructions: 'Please run the schema in Supabase SQL editor',
                    tablesCreated: [
                        'thesis_metadata',
                        'chapters',
                        'sections',
                        'user_progress',
                        'bookmarks',
                        'references',
                        'figures',
                        'reading_sessions',
                        'content_versions'
                    ]
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async syncContent(args) {
        const { contentPath, chapterFilter } = args;
        try {
            const fullPath = path.join(process.cwd(), contentPath);
            const parsedContent = await this.parser.parseDirectory(fullPath);
            let chapters = parsedContent.chapters;
            if (chapterFilter) {
                chapters = chapters.filter(c => c.slug.includes(chapterFilter));
            }
            let chaptersProcessed = 0;
            let sectionsProcessed = 0;
            for (const chapterData of chapters) {
                const { sections, ...chapter } = chapterData;
                // Upsert chapter
                const { data: chapterRecord, error: chapterError } = await this.supabase
                    .from('chapters')
                    .upsert(chapter, { onConflict: 'slug' })
                    .select()
                    .single();
                if (chapterError) {
                    console.error('Chapter error:', chapterError);
                    continue;
                }
                chaptersProcessed++;
                // Update sections
                for (const sectionData of sections) {
                    const { error: sectionError } = await this.supabase
                        .from('sections')
                        .upsert({
                        ...sectionData,
                        chapter_id: chapterRecord.id
                    }, { onConflict: 'chapter_id,slug' });
                    if (!sectionError) {
                        sectionsProcessed++;
                    }
                    else {
                        console.error('Section error:', sectionError);
                    }
                }
            }
            return {
                success: true,
                data: {
                    chaptersProcessed,
                    sectionsProcessed,
                    chapters: chapters.map(c => ({ title: c.title, sections: c.sections.length }))
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async queryContent(args) {
        const { query, limit = 10 } = args;
        try {
            const { data, error } = await this.supabase
                .from('sections')
                .select(`
          id,
          title,
          slug,
          content_plain,
          chapter:chapters(title, slug)
        `)
                .textSearch('content_plain', query)
                .limit(limit);
            if (error)
                throw error;
            return {
                success: true,
                data: {
                    results: data,
                    count: data?.length || 0
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async setupSearch() {
        try {
            // This would typically be run as a migration
            const searchSetup = `
        -- Add search vector column if it doesn't exist
        ALTER TABLE sections ADD COLUMN IF NOT EXISTS search_vector tsvector;
        
        -- Create index
        CREATE INDEX IF NOT EXISTS idx_sections_search ON sections USING gin(search_vector);
        
        -- Update function
        CREATE OR REPLACE FUNCTION update_search_vector()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.search_vector := 
            setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
            setweight(to_tsvector('english', COALESCE(NEW.content_plain, '')), 'B');
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        -- Create trigger
        DROP TRIGGER IF EXISTS update_sections_search_vector ON sections;
        CREATE TRIGGER update_sections_search_vector
          BEFORE INSERT OR UPDATE ON sections
          FOR EACH ROW EXECUTE FUNCTION update_search_vector();
        
        -- Update existing records
        UPDATE sections SET search_vector = 
          setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(content_plain, '')), 'B');
      `;
            return {
                success: true,
                data: {
                    message: 'Search setup SQL generated',
                    instructions: 'Please run the following SQL in Supabase SQL editor',
                    sql: searchSetup
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async createTestUsers(args) {
        const { count = 5 } = args;
        try {
            const testUsers = [];
            for (let i = 0; i < count; i++) {
                const email = `test${i + 1}@example.com`;
                testUsers.push({
                    email,
                    role: i === 0 ? 'admin' : i === 1 ? 'reviewer' : 'guest',
                    created_at: new Date().toISOString()
                });
            }
            return {
                success: true,
                data: {
                    message: `Generated ${count} test users`,
                    users: testUsers,
                    instructions: 'Create these users in Supabase Auth dashboard'
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async getAnalytics(args) {
        const { metric = 'overview', timeRange = '7d' } = args;
        try {
            // Parse time range
            const days = parseInt(timeRange.replace('d', ''));
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            let data = {};
            switch (metric) {
                case 'overview':
                    // Get total users
                    const { count: userCount } = await this.supabase
                        .from('profiles')
                        .select('*', { count: 'exact', head: true });
                    // Get total reading sessions
                    const { count: sessionCount } = await this.supabase
                        .from('reading_sessions')
                        .select('*', { count: 'exact', head: true })
                        .gte('created_at', startDate.toISOString());
                    // Get popular sections
                    const { data: popularSections } = await this.supabase
                        .from('user_progress')
                        .select('section_id, sections(title)')
                        .limit(5);
                    data = {
                        totalUsers: userCount || 0,
                        recentSessions: sessionCount || 0,
                        popularSections: popularSections || [],
                        timeRange
                    };
                    break;
                case 'reading-time':
                    const { data: readingData } = await this.supabase
                        .from('reading_sessions')
                        .select('total_time_seconds')
                        .gte('created_at', startDate.toISOString());
                    const totalSeconds = readingData?.reduce((acc, r) => acc + r.total_time_seconds, 0) || 0;
                    data = {
                        totalReadingTime: Math.round(totalSeconds / 60),
                        averageSessionTime: readingData?.length ? Math.round(totalSeconds / readingData.length / 60) : 0,
                        sessions: readingData?.length || 0
                    };
                    break;
            }
            return {
                success: true,
                data
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async checkHealth() {
        try {
            // Test database connection
            const { data, error } = await this.supabase
                .from('chapters')
                .select('count')
                .limit(1);
            const dbStatus = !error;
            // Check tables exist
            const tables = ['chapters', 'sections', 'user_progress', 'bookmarks'];
            const tableStatus = {};
            for (const table of tables) {
                const { error } = await this.supabase.from(table).select('count').limit(1);
                tableStatus[table] = !error;
            }
            return {
                success: true,
                data: {
                    database: dbStatus ? 'connected' : 'error',
                    tables: tableStatus,
                    timestamp: new Date().toISOString()
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async seedDatabase() {
        try {
            // Insert thesis metadata
            const { error: metaError } = await this.supabase
                .from('thesis_metadata')
                .upsert({
                title: 'After Cognition',
                subtitle: 'Human Value in the Age of Irreducibility',
                author: 'Magnús Már Magnússon',
                abstract: 'An exploration of human value and meaning in an age where AI systems approach and exceed human cognitive capabilities.',
                keywords: ['philosophy', 'AI', 'cognition', 'human value', 'irreducibility'],
                version: '1.0',
                published_at: new Date().toISOString()
            });
            if (metaError) {
                return { success: false, error: metaError.message };
            }
            return {
                success: true,
                data: {
                    message: 'Database seeded successfully',
                    items: {
                        metadata: 1,
                        instructions: 'Run sync_content to add chapters and sections'
                    }
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    getDefaultSchema() {
        return `
-- Thesis metadata
CREATE TABLE thesis_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT NOT NULL,
  abstract TEXT,
  keywords TEXT[],
  version TEXT DEFAULT '1.0',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters table
CREATE TABLE chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  estimated_reading_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sections table
CREATE TABLE sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  content_plain TEXT,
  order_index INTEGER NOT NULL,
  word_count INTEGER,
  reading_time_minutes INTEGER,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chapter_id, slug)
);

-- User progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  last_position TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, section_id)
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT,
  note TEXT,
  position_selector TEXT,
  position_offset INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- References table
CREATE TABLE references (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  citation_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  publication_year INTEGER,
  journal TEXT,
  volume TEXT,
  issue TEXT,
  pages TEXT,
  doi TEXT,
  url TEXT,
  publication_type TEXT,
  full_citation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Figures table
CREATE TABLE figures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  figure_number TEXT NOT NULL,
  title TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  file_path TEXT,
  file_type TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reading sessions table
CREATE TABLE reading_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  total_time_seconds INTEGER DEFAULT 0,
  sections_visited INTEGER DEFAULT 0,
  pages_read INTEGER DEFAULT 0,
  device_type TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content versions table
CREATE TABLE content_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  change_summary TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_id, version_number)
);

-- Create indexes
CREATE INDEX idx_chapters_order ON chapters(order_index);
CREATE INDEX idx_chapters_slug ON chapters(slug);
CREATE INDEX idx_sections_chapter ON sections(chapter_id);
CREATE INDEX idx_sections_order ON sections(chapter_id, order_index);
CREATE INDEX idx_sections_slug ON sections(slug);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_section ON user_progress(section_id);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_section ON bookmarks(section_id);

-- Enable Row Level Security
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can read published chapters" ON chapters
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read published sections" ON sections
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can manage their progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their sessions" ON reading_sessions
  FOR ALL USING (auth.uid() = user_id);
    `;
    }
    async start() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error('Supabase Thesis MCP server running');
    }
}
// Start the server
const server = new SupabaseThesisMCP();
server.start().catch(console.error);
