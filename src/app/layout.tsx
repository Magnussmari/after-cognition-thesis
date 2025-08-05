import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'After Cognition - Human Value in the Age of Irreducibility',
  description: 'An exploration of human value and meaning in an age where AI systems approach and exceed human cognitive capabilities.',
  keywords: 'philosophy, AI, cognition, human value, irreducibility, thesis',
  authors: [{ name: 'Magnús Már Magnússon' }],
  openGraph: {
    title: 'After Cognition',
    description: 'Human Value in the Age of Irreducibility',
    type: 'book',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        {children}
      </body>
    </html>
  );
}