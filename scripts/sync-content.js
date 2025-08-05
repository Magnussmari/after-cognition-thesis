#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Content parser class
class ContentSyncer {
  constructor() {
    this.chaptersProcessed = 0;
    this.sectionsProcessed = 0;
    this.errors = [];
  }

  async syncContent() {
    try {
      console.log('🚀 Starting content sync...');
      
      // Parse HTML files from docs/parts directory
      const htmlDir = path.join(__dirname, '..', 'docs', 'parts');
      const files = await fs.readdir(htmlDir);
      const htmlFiles = files.filter(f => f.endsWith('.html')).sort();
      
      console.log(`📁 Found ${htmlFiles.length} HTML files to process`);
      
      for (const file of htmlFiles) {
        await this.processChapterFile(path.join(htmlDir, file), file);
      }
      
      console.log('\n✅ Content sync completed!');
      console.log(`📊 Chapters processed: ${this.chaptersProcessed}`);
      console.log(`📊 Sections processed: ${this.sectionsProcessed}`);
      
      if (this.errors.length > 0) {
        console.log('\n⚠️  Errors encountered:');
        this.errors.forEach(err => console.log(`  - ${err}`));
      }
      
    } catch (error) {
      console.error('❌ Content sync failed:', error);
      process.exit(1);
    }
  }

  async processChapterFile(filePath, filename) {
    try {
      console.log(`\n📄 Processing ${filename}...`);
      
      const content = await fs.readFile(filePath, 'utf-8');
      const $ = cheerio.load(content);
      
      // Extract chapter info
      const chapterTitle = this.extractChapterTitle($, filename);
      const chapterSlug = this.generateSlug(chapterTitle);
      const orderIndex = this.extractOrderIndex(filename);
      
      // Create or update chapter
      const { data: chapter, error: chapterError } = await supabase
        .from('chapters')
        .upsert({
          title: chapterTitle,
          slug: chapterSlug,
          order_index: orderIndex,
          is_published: true,
          description: this.extractDescription($)
        }, { onConflict: 'slug' })
        .select()
        .single();
      
      if (chapterError) {
        this.errors.push(`Chapter "${chapterTitle}": ${chapterError.message}`);
        return;
      }
      
      console.log(`✓ Chapter "${chapterTitle}" created/updated`);
      this.chaptersProcessed++;
      
      // Process sections
      await this.processSections($, chapter.id);
      
    } catch (error) {
      this.errors.push(`File ${filename}: ${error.message}`);
    }
  }

  async processSections($, chapterId) {
    const sections = [];
    let sectionIndex = 0;
    
    // Strategy: Look for major content divisions
    // Try multiple selectors to find sections
    const sectionSelectors = [
      'section',
      '.section',
      'div.section',
      '[class*="section"]'
    ];
    
    let $sections = $();
    for (const selector of sectionSelectors) {
      $sections = $(selector);
      if ($sections.length > 0) break;
    }
    
    // If no sections found, treat each h2/h3 as a section start
    if ($sections.length === 0) {
      const headings = $('h2, h3');
      
      headings.each((i, heading) => {
        const $heading = $(heading);
        const title = $heading.text().trim();
        if (!title) return;
        
        // Get content between this heading and the next
        let contentHtml = '';
        let contentText = '';
        let $current = $heading;
        
        // Collect all elements until the next heading
        while ($current.next().length && !$current.next().is('h1, h2, h3')) {
          $current = $current.next();
          contentHtml += $.html($current);
          contentText += $current.text() + ' ';
        }
        
        // Include the heading itself
        contentHtml = $.html($heading) + contentHtml;
        contentText = title + ' ' + contentText;
        
        sections.push({
          title,
          slug: this.generateSlug(title),
          content: contentHtml,
          content_plain: contentText.trim(),
          order_index: sectionIndex++,
          word_count: this.countWords(contentText),
          reading_time_minutes: this.calculateReadingTime(contentText),
          is_published: true,
          chapter_id: chapterId
        });
      });
    } else {
      // Process found sections
      $sections.each((i, section) => {
        const $section = $(section);
        const title = $section.find('h1, h2, h3, h4').first().text().trim() || `Section ${i + 1}`;
        const contentHtml = $section.html() || '';
        const contentText = $section.text().trim();
        
        sections.push({
          title,
          slug: this.generateSlug(title),
          content: contentHtml,
          content_plain: contentText,
          order_index: sectionIndex++,
          word_count: this.countWords(contentText),
          reading_time_minutes: this.calculateReadingTime(contentText),
          is_published: true,
          chapter_id: chapterId
        });
      });
    }
    
    // If still no sections, create one from the entire content
    if (sections.length === 0) {
      const bodyContent = $('body').html() || $('main').html() || $.html();
      const bodyText = $('body').text() || $('main').text() || $.text();
      
      sections.push({
        title: 'Main Content',
        slug: 'main-content',
        content: bodyContent,
        content_plain: bodyText.trim(),
        order_index: 0,
        word_count: this.countWords(bodyText),
        reading_time_minutes: this.calculateReadingTime(bodyText),
        is_published: true,
        chapter_id: chapterId
      });
    }
    
    // Upload sections
    for (const section of sections) {
      const { error } = await supabase
        .from('sections')
        .upsert(section, { onConflict: 'chapter_id,slug' });
      
      if (error) {
        this.errors.push(`Section "${section.title}": ${error.message}`);
      } else {
        console.log(`  ✓ Section "${section.title}" created/updated`);
        this.sectionsProcessed++;
      }
    }
  }

  extractChapterTitle($, filename) {
    // Try multiple strategies to extract title
    let title = $('h1').first().text().trim();
    
    if (!title) {
      title = $('title').text().trim();
    }
    
    if (!title) {
      title = $('.chapter-title').text().trim();
    }
    
    if (!title) {
      // Extract from filename
      title = filename
        .replace('.html', '')
        .replace(/^\d+-/, '') // Remove number prefix
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase()); // Title case
    }
    
    return title;
  }

  extractDescription($) {
    // Try to extract a description or abstract
    let description = $('meta[name="description"]').attr('content') || '';
    
    if (!description) {
      // Get first paragraph
      description = $('p').first().text().trim();
      if (description.length > 200) {
        description = description.substring(0, 197) + '...';
      }
    }
    
    return description;
  }

  extractOrderIndex(filename) {
    // Extract order from filename (e.g., "01-prologue.html" -> 1)
    const match = filename.match(/^(\d+)-/);
    return match ? parseInt(match[1]) : 999;
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
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }
}

// Process references/citations if they exist
async function processReferences() {
  try {
    // Check if references file exists
    const referencesPath = path.join(__dirname, '..', 'resources', 'AC_references.bib');
    
    try {
      await fs.access(referencesPath);
      console.log('\n📚 Processing references...');
      
      // For now, we'll skip BibTeX parsing
      // In production, you'd use a BibTeX parser
      console.log('  ℹ️  BibTeX parsing not implemented yet');
      
    } catch {
      console.log('\n📚 No references file found, skipping...');
    }
  } catch (error) {
    console.error('Error processing references:', error);
  }
}

// Main execution
async function main() {
  const syncer = new ContentSyncer();
  await syncer.syncContent();
  await processReferences();
}

// Run the sync
main().catch(console.error);