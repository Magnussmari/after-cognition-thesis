'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Chapter, UserProgress } from '@/types/thesis';
import { getUserProgress } from '@/utils/supabase-utils';
import { useAuth } from '@/hooks/useAuth';

interface ChapterListProps {
  chapters: Chapter[];
}

export default function ChapterList({ chapters }: ChapterListProps) {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const progress = await getUserProgress(user.id);
        const progressMap = new Map<string, number>();
        
        // Calculate chapter progress
        chapters.forEach(chapter => {
          const chapterSections = progress.filter(
            p => p.section?.chapter_id === chapter.id
          );
          
          if (chapterSections.length > 0) {
            const totalProgress = chapterSections.reduce(
              (sum, p) => sum + p.progress_percentage,
              0
            );
            progressMap.set(chapter.id, totalProgress / chapterSections.length);
          }
        });
        
        setUserProgress(progressMap);
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [user, chapters]);

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-600 dark:text-green-400';
    if (progress >= 50) return 'text-blue-600 dark:text-blue-400';
    if (progress > 0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-400 dark:text-gray-600';
  };

  const getProgressRingColor = (progress: number) => {
    if (progress >= 100) return 'stroke-green-600 dark:stroke-green-400';
    if (progress >= 50) return 'stroke-blue-600 dark:stroke-blue-400';
    if (progress > 0) return 'stroke-yellow-600 dark:stroke-yellow-400';
    return 'stroke-gray-300 dark:stroke-gray-700';
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {chapters.map((chapter) => {
        const progress = userProgress.get(chapter.id) || 0;
        
        return (
          <Link
            key={chapter.id}
            href={`/chapters/${chapter.slug}`}
            className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            {/* Progress indicator */}
            <div className="absolute top-4 right-4">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                    className={getProgressRingColor(progress)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-semibold ${getProgressColor(progress)}`}>
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Chapter content */}
            <div className="pr-16">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Chapter {chapter.order_index}</span>
                {chapter.estimated_reading_time && (
                  <>
                    <span>•</span>
                    <span>{chapter.estimated_reading_time} min read</span>
                  </>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {chapter.title}
              </h3>
              
              {chapter.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                  {chapter.description}
                </p>
              )}

              {/* Section count */}
              {chapter.section_count !== undefined && (
                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>{chapter.section_count} sections</span>
                </div>
              )}

              {/* Continue reading indicator */}
              {progress > 0 && progress < 100 && (
                <div className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  Continue reading
                  <svg
                    className="w-4 h-4 ml-1"
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
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}