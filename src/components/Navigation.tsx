'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Logo/Title */}
          <Link
            href="/"
            className="text-lg font-serif text-gray-900 dark:text-white"
          >
            After Cognition
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center space-x-6">
            <Link
              href="/chapters"
              className={`text-sm ${
                isActive('/chapters')
                  ? 'text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Chapters
            </Link>
            
            <Link
              href="/bookmarks"
              className={`text-sm ${
                isActive('/bookmarks')
                  ? 'text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Bookmarks
            </Link>
            
            <Link
              href="/progress"
              className={`text-sm ${
                isActive('/progress')
                  ? 'text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Progress
            </Link>

            {user && (
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}