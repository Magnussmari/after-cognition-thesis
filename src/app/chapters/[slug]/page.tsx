import { notFound, redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ChapterReader from '@/components/ChapterReader';
import { createClient } from '@/lib/supabase/server';
import { getChapter, getUserProgress } from '@/utils/supabase-utils';

interface ChapterPageProps {
  params: {
    slug: string;
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const chapter = await getChapter(params.slug);
    
    if (!chapter) {
      notFound();
    }

    // Get user progress for this chapter
    const userProgress = await getUserProgress(user.id);
    const chapterProgress = userProgress.filter(
      p => p.section?.chapter_id === chapter.id
    );

    return (
      <div className="min-h-screen">
        <Navigation />
        
        <main className="pt-16">
          <ChapterReader 
            chapter={chapter} 
            userProgress={chapterProgress}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading chapter:', error);
    notFound();
  }
}