export interface ThesisMetadata {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  abstract: string;
  keywords: string[];
  version: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  description?: string;
  order_index: number;
  is_published: boolean;
  estimated_reading_time?: number;
  created_at: string;
  updated_at: string;
  sections?: Section[];
  section_count?: number;
  total_words?: number;
  total_reading_time?: number;
}

export interface Section {
  id: string;
  chapter_id: string;
  title: string;
  slug: string;
  content: string;
  content_plain?: string;
  order_index: number;
  word_count?: number;
  reading_time_minutes?: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  chapter?: Chapter;
  search_vector?: any;
}

export interface UserProgress {
  id: string;
  user_id: string;
  section_id: string;
  progress_percentage: number;
  completed_at?: string;
  time_spent_seconds: number;
  last_position?: string;
  created_at: string;
  updated_at: string;
  section?: Section;
}

export interface Bookmark {
  id: string;
  user_id: string;
  section_id: string;
  title?: string;
  note?: string;
  position_selector?: string;
  position_offset: number;
  created_at: string;
  updated_at: string;
  section?: Section;
}

export interface ReadingSession {
  id: string;
  user_id: string;
  session_start: string;
  session_end?: string;
  total_time_seconds: number;
  sections_visited: number;
  pages_read: number;
  device_type?: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
}

export interface Citation {
  id: string;
  citation_key: string;
  title: string;
  authors: string[];
  publication_year?: number;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  publication_type?: string;
  full_citation: string;
  created_at: string;
}

export interface Figure {
  id: string;
  section_id: string;
  figure_number: string;
  title: string;
  caption?: string;
  alt_text?: string;
  file_path?: string;
  file_type?: string;
  width?: number;
  height?: number;
  created_at: string;
}

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  content_preview: string;
  chapter: {
    title: string;
    slug: string;
  };
  relevance_score?: number;
}

export interface ReadingStats {
  user_id: string;
  sections_read: number;
  chapters_started: number;
  total_time_seconds: number;
  avg_progress: number;
}