export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ChapterList from '@/components/ChapterList';
import { createClient } from '@/lib/supabase/server';
import { getChapters } from '@/utils/supabase-utils';

export default async function ChaptersPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Get all published chapters
  const chapters = await getChapters();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Simple header */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-gray-900 dark:text-white mb-2">
              Table of Contents
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {chapters.length} chapters • {chapters.reduce((sum, ch) => sum + (ch.section_count || 0), 0)} sections
            </p>
          </div>

          {/* Chapter List */}
          <ChapterList chapters={chapters} />
        </div>
      </main>
    </div>
  );
}