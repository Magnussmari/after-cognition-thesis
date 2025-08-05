# Database Schema Design

## 📊 Complete Schema Overview

### Core Content Tables

#### `thesis_metadata`
```sql
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
```

#### `chapters`
```sql
CREATE TABLE chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  estimated_reading_time INTEGER, -- minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for ordering
CREATE INDEX idx_chapters_order ON chapters(order_index);
CREATE INDEX idx_chapters_slug ON chapters(slug);
```

#### `sections`
```sql
CREATE TABLE sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL, -- Processed HTML from Quarto
  content_plain TEXT, -- Plain text for search
  order_index INTEGER NOT NULL,
  word_count INTEGER,
  reading_time_minutes INTEGER,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chapter_id, slug)
);

-- Indexes for performance
CREATE INDEX idx_sections_chapter ON sections(chapter_id);
CREATE INDEX idx_sections_order ON sections(chapter_id, order_index);
CREATE INDEX idx_sections_slug ON sections(slug);

-- Full-text search
ALTER TABLE sections ADD COLUMN search_vector tsvector;
CREATE INDEX idx_sections_search ON sections USING gin(search_vector);
```

### User Engagement Tables

#### `user_progress`
```sql
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  last_position TEXT, -- DOM element ID or scroll position
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, section_id)
);

-- Indexes for analytics
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_section ON user_progress(section_id);
CREATE INDEX idx_user_progress_completed ON user_progress(completed_at) WHERE completed_at IS NOT NULL;
```

#### `bookmarks`
```sql
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT,
  note TEXT,
  position_selector TEXT, -- CSS selector or element ID
  position_offset INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_section ON bookmarks(section_id);
```

### Academic Content Tables

#### `references`
```sql
CREATE TABLE references (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  citation_key TEXT UNIQUE NOT NULL, -- e.g., "smith2023"
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  publication_year INTEGER,
  journal TEXT,
  volume TEXT,
  issue TEXT,
  pages TEXT,
  doi TEXT,
  url TEXT,
  publication_type TEXT, -- 'journal', 'book', 'conference', etc.
  full_citation TEXT NOT NULL, -- Formatted citation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_references_key ON references(citation_key);
CREATE INDEX idx_references_year ON references(publication_year);
```

#### `figures`
```sql
CREATE TABLE figures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  figure_number TEXT NOT NULL, -- e.g., "1.1", "2.3"
  title TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  file_path TEXT, -- Path in Supabase Storage
  file_type TEXT, -- 'svg', 'png', 'jpg', etc.
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_figures_section ON figures(section_id);
```

### Analytics & System Tables

#### `reading_sessions`
```sql
CREATE TABLE reading_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  total_time_seconds INTEGER DEFAULT 0,
  sections_visited INTEGER DEFAULT 0,
  pages_read INTEGER DEFAULT 0,
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON reading_sessions(user_id);
CREATE INDEX idx_sessions_date ON reading_sessions(session_start);
```

#### `content_versions`
```sql
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

CREATE INDEX idx_versions_section ON content_versions(section_id, version_number);
```

## 🔐 Row Level Security Policies

### Basic Access Control
```sql
-- Enable RLS on all tables
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access to published content
CREATE POLICY "Public can read published chapters" ON chapters
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read published sections" ON sections
  FOR SELECT USING (is_published = true);

-- Users can only access their own data
CREATE POLICY "Users can manage their progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their sessions" ON reading_sessions
  FOR ALL USING (auth.uid() = user_id);
```

### Admin Access (for content management)
```sql
-- Admin role for content management
CREATE POLICY "Admins can manage all content" ON chapters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage all sections" ON sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );
```

## 🔍 Database Functions & Triggers

### Search Function
```sql
-- Update search vector when content changes
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content_plain, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sections_search_vector
  BEFORE INSERT OR UPDATE ON sections
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();
```

### Reading Time Calculator
```sql
CREATE OR REPLACE FUNCTION calculate_reading_time(content_text TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
  reading_time INTEGER;
BEGIN
  -- Count words (average reading speed: 200 wpm)
  word_count := array_length(string_to_array(content_text, ' '), 1);
  reading_time := CEIL(word_count / 200.0);
  RETURN GREATEST(reading_time, 1); -- Minimum 1 minute
END;
$$ LANGUAGE plpgsql;
```

### Auto-update Timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 📈 Performance Optimization

### Essential Indexes
```sql
-- Composite indexes for common queries
CREATE INDEX idx_sections_chapter_published ON sections(chapter_id, is_published);
CREATE INDEX idx_user_progress_completion ON user_progress(user_id, completed_at);
CREATE INDEX idx_bookmarks_user_created ON bookmarks(user_id, created_at DESC);

-- Partial indexes for performance
CREATE INDEX idx_published_chapters ON chapters(order_index) WHERE is_published = true;
CREATE INDEX idx_published_sections ON sections(chapter_id, order_index) WHERE is_published = true;
```

### Database Views for Common Queries
```sql
-- Chapter overview with section count
CREATE VIEW chapter_overview AS
SELECT 
  c.*,
  COUNT(s.id) as section_count,
  SUM(s.word_count) as total_words,
  SUM(s.reading_time_minutes) as total_reading_time
FROM chapters c
LEFT JOIN sections s ON c.id = s.chapter_id AND s.is_published = true
WHERE c.is_published = true
GROUP BY c.id
ORDER BY c.order_index;

-- User reading statistics
CREATE VIEW user_reading_stats AS
SELECT 
  up.user_id,
  COUNT(DISTINCT up.section_id) as sections_read,
  COUNT(DISTINCT s.chapter_id) as chapters_started,
  SUM(up.time_spent_seconds) as total_time_seconds,
  AVG(up.progress_percentage) as avg_progress
FROM user_progress up
JOIN sections s ON up.section_id = s.id
GROUP BY up.user_id;
```

---

**Next:** Review implementation phases in `03-IMPLEMENTATION-PHASES.md`
