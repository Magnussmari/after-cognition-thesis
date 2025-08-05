export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProgress, getUserReadingStats, getChapters } from '@/utils/supabase-utils';

export default async function ProgressPage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Get user progress and stats
  const [progress, stats, chapters] = await Promise.all([
    getUserProgress(user.id),
    getUserReadingStats(user.id),
    getChapters()
  ]);

  // Calculate chapter completion
  const chapterProgress = chapters.map(chapter => {
    const chapterSections = progress.filter(p => p.section?.chapter_id === chapter.id);
    const totalProgress = chapterSections.reduce((sum, p) => sum + p.progress_percentage, 0);
    const avgProgress = chapterSections.length > 0 ? totalProgress / chapterSections.length : 0;
    
    return {
      ...chapter,
      progress: avgProgress,
      sectionsCompleted: chapterSections.filter(p => p.progress_percentage === 100).length,
      totalSections: chapter.section_count || 0
    };
  });

  // Overall completion
  const overallProgress = chapterProgress.reduce((sum, ch) => sum + ch.progress, 0) / chapters.length;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Reading Progress
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Track your journey through "After Cognition"
            </p>
          </div>

          {/* Overall Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Overall Progress
            </h2>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Total Completion</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 dark:bg-blue-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Chapters Started
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats?.chapters_started || 0} / {chapters.length}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Sections Read
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats?.sections_read || 0}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Reading Time
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {Math.round((stats?.total_time_seconds || 0) / 60)} min
                </p>
              </div>
            </div>
          </div>

          {/* Chapter Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chapter Progress
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {chapterProgress.map((chapter) => (
                <div key={chapter.id} className="px-8 py-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {chapter.sectionsCompleted} of {chapter.totalSections} sections completed
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {Math.round(chapter.progress)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        chapter.progress === 100
                          ? 'bg-green-600 dark:bg-green-400'
                          : chapter.progress > 0
                          ? 'bg-blue-600 dark:bg-blue-400'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      style={{ width: `${chapter.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
            </div>
            
            <div className="px-8 py-6">
              {progress.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.section?.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.section?.chapter?.title}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.progress_percentage}% complete
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {progress.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No reading activity yet. Start reading to track your progress!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}