export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Get thesis metadata
  const { data: thesis, error: thesisError } = await supabase
    .from('thesis_metadata')
    .select('*')
    .single();
  
  if (thesisError) {
    console.error('Error fetching thesis metadata:', thesisError);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Simple, clean header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-serif text-gray-900 dark:text-white mb-4">
              {thesis?.title || 'After Cognition'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 italic">
              {thesis?.subtitle || 'Human Value in the Age of Irreducibility'}
            </p>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              {thesis?.author || 'Magnús Smári Smárason'}
            </p>
          </div>

          {/* Abstract */}
          {thesis?.abstract && (
            <div className="prose prose-lg dark:prose-invert mx-auto mb-12">
              <h2 className="text-xl font-semibold mb-4">Abstract</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {thesis.abstract}
              </p>
            </div>
          )}

          {/* Simple navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link
              href="/chapters"
              className="inline-block px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-center"
            >
              Read Thesis
            </Link>
            
            <Link
              href="/progress"
              className="inline-block px-6 py-3 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              View Progress
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}