'use client';

import Link from 'next/link';
import { Chapter } from '@/types/thesis';

interface ChapterListProps {
  chapters: Chapter[];
}

export default function ChapterList({ chapters }: ChapterListProps) {
  return (
    <div className="space-y-2">
      {chapters.map((chapter) => (
        <Link
          key={chapter.id}
          href={`/chapters/${chapter.slug}`}
          className="block p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <div className="flex items-baseline justify-between">
            <div className="flex-1">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                Chapter {chapter.order_index}
              </span>
              <span className="text-lg text-gray-900 dark:text-white">
                {chapter.title}
              </span>
            </div>
            {chapter.section_count !== undefined && (
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                {chapter.section_count} sections
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}