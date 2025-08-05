import { notFound, redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ChapterReader from '@/components/ChapterReader';
import { createClient } from '@/lib/supabase/server';
import { getChapter, getSection, getUserProgress, startReadingSession } from '@/utils/supabase-utils';

interface SectionPageProps {
  params: {
    slug: string;
    section: string;
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  try {
    // Get chapter and section
    const chapter = await getChapter(params.slug);
    const section = await getSection(params.slug, params.section);
    
    if (!chapter || !section) {
      notFound();
    }

    // Start a reading session
    // In a real app, you'd want to track this more carefully
    const deviceType = 'desktop'; // This would be detected client-side
    await startReadingSession(user.id, deviceType);

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
            currentSection={section}
            userProgress={chapterProgress}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading section:', error);
    notFound();
  }
}