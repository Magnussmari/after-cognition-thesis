export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserBookmarks, deleteBookmark } from '@/utils/supabase-utils';

export default async function BookmarksPage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  const bookmarks = await getUserBookmarks(user.id);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              My Bookmarks
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your saved passages and annotations from the thesis
            </p>
          </div>

          {/* Bookmarks List */}
          {bookmarks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No bookmarks yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Highlight text while reading to create bookmarks
              </p>
              <Link
                href="/chapters"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                Start Reading
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Bookmark title or excerpt */}
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {bookmark.title || 'Untitled Bookmark'}
                      </h3>
                      
                      {/* Note content */}
                      {bookmark.note && (
                        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 mb-4">
                          <p className="text-gray-600 dark:text-gray-300 italic">
                            "{bookmark.note}"
                          </p>
                        </blockquote>
                      )}
                      
                      {/* Chapter and section info */}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                        <span>
                          {bookmark.section?.chapter?.title} → {bookmark.section?.title}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(bookmark.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/chapters/${bookmark.section?.chapter?.slug}/${bookmark.section?.slug}`}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Go to section"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>
                      
                      <form
                        action={async () => {
                          'use server';
                          await deleteBookmark(bookmark.id);
                          redirect('/bookmarks');
                        }}
                      >
                        <button
                          type="submit"
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete bookmark"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}