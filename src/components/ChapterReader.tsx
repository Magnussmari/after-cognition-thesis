'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Chapter, Section, UserProgress } from '@/types/thesis';
import { updateProgress, createBookmark } from '@/utils/supabase-utils';
import { useAuth } from '@/hooks/useAuth';

interface ChapterReaderProps {
  chapter: Chapter;
  currentSection?: Section;
  userProgress?: UserProgress[];
}

export default function ChapterReader({ 
  chapter, 
  currentSection,
  userProgress = []
}: ChapterReaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookmarkCreating, setBookmarkCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedText, setSelectedText] = useState('');

  // Update reading progress
  useEffect(() => {
    if (!user || !currentSection) return;

    const updateReadingProgress = async () => {
      // Calculate scroll progress
      const handleScroll = () => {
        if (!contentRef.current) return;
        
        const scrollTop = window.scrollY;
        const docHeight = contentRef.current.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        setProgress(Math.min(100, Math.max(0, scrollPercent)));
      };

      window.addEventListener('scroll', handleScroll);
      
      // Update progress every 5 seconds if user is active
      const interval = setInterval(async () => {
        if (progress > 0) {
          try {
            await updateProgress(user.id, currentSection.id, progress);
          } catch (error) {
            console.error('Error updating progress:', error);
          }
        }
      }, 5000);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearInterval(interval);
        
        // Save final progress on unmount
        if (progress > 0) {
          updateProgress(user.id, currentSection.id, progress).catch(console.error);
        }
      };
    };

    updateReadingProgress();
  }, [user, currentSection, progress]);

  // Handle text selection for bookmarking
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        setSelectedText(selection.toString().trim());
      } else {
        setSelectedText('');
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  const handleBookmark = async () => {
    if (!user || !currentSection || !selectedText) return;

    setBookmarkCreating(true);
    try {
      await createBookmark(
        user.id,
        currentSection.id,
        selectedText.substring(0, 100),
        selectedText,
        window.getSelection()?.anchorNode?.parentElement?.id
      );
      
      // Clear selection
      window.getSelection()?.removeAllRanges();
      setSelectedText('');
    } catch (error) {
      console.error('Error creating bookmark:', error);
    } finally {
      setBookmarkCreating(false);
    }
  };

  const navigateToSection = (section: Section) => {
    router.push(`/chapters/${chapter.slug}/${section.slug}`);
  };

  const getSectionProgress = (sectionId: string) => {
    const progress = userProgress.find(p => p.section_id === sectionId);
    return progress?.progress_percentage || 0;
  };

  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 overflow-hidden bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            Table of Contents
          </h3>
          <nav className="space-y-1">
            {chapter.sections?.map((section) => {
              const isActive = currentSection?.id === section.id;
              const progress = getSectionProgress(section.id);
              
              return (
                <button
                  key={section.id}
                  onClick={() => navigateToSection(section)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors relative ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate pr-2">{section.title}</span>
                    {progress > 0 && (
                      <span
                        className={`text-xs ${
                          progress === 100
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-400 dark:text-gray-600'
                        }`}
                      >
                        {progress === 100 ? '✓' : `${Math.round(progress)}%`}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 z-10 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            )}
          </svg>
        </button>

        {/* Progress Bar */}
        <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-20">
          <div
            className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <article
          ref={contentRef}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          {/* Chapter Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <Link
                href="/chapters"
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Chapters
              </Link>
              <span>/</span>
              <span>{chapter.title}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {chapter.title}
            </h1>
            
            {chapter.description && (
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {chapter.description}
              </p>
            )}
          </header>

          {/* Section Content */}
          {currentSection ? (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-6">{currentSection.title}</h2>
              
              {/* Render HTML content */}
              <div
                dangerouslySetInnerHTML={{ __html: currentSection.content }}
                className="thesis-content"
              />
              
              {/* Section Navigation */}
              <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  {chapter.sections && (
                    <>
                      {currentSection.order_index > 0 && (
                        <button
                          onClick={() => {
                            const prevSection = chapter.sections![currentSection.order_index - 1];
                            navigateToSection(prevSection);
                          }}
                          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          Previous
                        </button>
                      )}
                      
                      {currentSection.order_index < chapter.sections.length - 1 && (
                        <button
                          onClick={() => {
                            const nextSection = chapter.sections![currentSection.order_index + 1];
                            navigateToSection(nextSection);
                          }}
                          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 ml-auto"
                        >
                          Next
                          <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </nav>
            </div>
          ) : (
            // Chapter overview when no section is selected
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-300">
                Select a section from the table of contents to begin reading.
              </p>
              
              {chapter.sections && chapter.sections.length > 0 && (
                <div className="grid gap-4">
                  {chapter.sections.map((section) => {
                    const progress = getSectionProgress(section.id);
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => navigateToSection(section)}
                        className="text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {section.title}
                            </h3>
                            {section.reading_time_minutes && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {section.reading_time_minutes} min read
                              </p>
                            )}
                          </div>
                          {progress > 0 && (
                            <span
                              className={`text-sm ${
                                progress === 100
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-blue-600 dark:text-blue-400'
                              }`}
                            >
                              {progress === 100 ? 'Completed' : `${Math.round(progress)}%`}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </article>

        {/* Bookmark Popup */}
        {selectedText && user && (
          <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Create bookmark from selection?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleBookmark}
                disabled={bookmarkCreating}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {bookmarkCreating ? 'Creating...' : 'Bookmark'}
              </button>
              <button
                onClick={() => {
                  window.getSelection()?.removeAllRanges();
                  setSelectedText('');
                }}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}