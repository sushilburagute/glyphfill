import 'glyphfill/styles.css';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Big_Shoulders, Fraunces, Inter, Recursive } from 'next/font/google';
import type { ReactNode } from 'react';

// next/font has no fallback metrics for Big Shoulders yet.
const display = Big_Shoulders({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-display',
  adjustFontFallback: false,
});
const text = Recursive({ subsets: ['latin'], axes: ['CASL', 'MONO'], variable: '--font-text' });
const fraunces = Fraunces({ subsets: ['latin'], axes: ['opsz'], variable: '--font-fraunces', preload: false });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', preload: false });

export const metadata: Metadata = {
  title: 'glyphfill: progress inside a word',
  description:
    'A tiny library that makes letters heavier, or fills them with ink, as a task completes. For React and plain JavaScript.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1eff5' },
    { media: '(prefers-color-scheme: dark)', color: '#16121b' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
