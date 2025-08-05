import { createClient } from '@/lib/supabase/client';
import type { Chapter, Section, UserProgress, Bookmark } from '@/types/thesis';

// Chapter operations
export async function getChapters() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('chapters')
    .select(`
      *,
      sections:sections(count)
    `)
    .eq('is_published', true)
    .order('order_index');
  
  if (error) throw error;
  return data as Chapter[];
}

export async function getChapter(slug: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('chapters')
    .select(`
      *,
      sections(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  
  if (error) throw error;
  return data as Chapter;
}

// Section operations
export async function getSection(chapterSlug: string, sectionSlug: string) {
  const supabase = createClient();
  
  const { data: chapter } = await supabase
    .from('chapters')
    .select('id')
    .eq('slug', chapterSlug)
    .single();
  
  if (!chapter) throw new Error('Chapter not found');
  
  const { data, error } = await supabase
    .from('sections')
    .select(`
      *,
      chapter:chapters(*)
    `)
    .eq('chapter_id', chapter.id)
    .eq('slug', sectionSlug)
    .eq('is_published', true)
    .single();
  
  if (error) throw error;
  return data as Section;
}

// Progress tracking
export async function getUserProgress(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      section:sections(
        *,
        chapter:chapters(*)
      )
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data as UserProgress[];
}

export async function updateProgress(
  userId: string,
  sectionId: string,
  progress: number,
  position?: string
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      section_id: sectionId,
      progress_percentage: progress,
      last_position: position,
      completed_at: progress === 100 ? new Date().toISOString() : null
    }, {
      onConflict: 'user_id,section_id'
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as UserProgress;
}

// Bookmarks
export async function getUserBookmarks(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      *,
      section:sections(
        *,
        chapter:chapters(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Bookmark[];
}

export async function createBookmark(
  userId: string,
  sectionId: string,
  title?: string,
  note?: string,
  position?: string
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: userId,
      section_id: sectionId,
      title,
      note,
      position_selector: position
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as Bookmark;
}

export async function deleteBookmark(bookmarkId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId);
  
  if (error) throw error;
}

// Search
export async function searchContent(query: string, limit = 10) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('sections')
    .select(`
      id,
      title,
      slug,
      content_plain,
      chapter:chapters(title, slug)
    `)
    .textSearch('search_vector', query)
    .eq('is_published', true)
    .limit(limit);
  
  if (error) throw error;
  
  return data.map(section => ({
    ...section,
    content_preview: section.content_plain?.substring(0, 200) + '...'
  }));
}

// Reading sessions
export async function startReadingSession(userId: string, deviceType?: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('reading_sessions')
    .insert({
      user_id: userId,
      device_type: deviceType,
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null
    })
    .select()
    .single();
  
  if (error) throw error;
  return data.id;
}

export async function endReadingSession(
  sessionId: string,
  sectionsVisited: number,
  pagesRead: number
) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('reading_sessions')
    .update({
      session_end: new Date().toISOString(),
      sections_visited: sectionsVisited,
      pages_read: pagesRead
    })
    .eq('id', sessionId);
  
  if (error) throw error;
}

// Analytics
export async function getUserReadingStats(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_reading_stats')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}