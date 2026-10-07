import 'glyphfill/styles.css';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { Big_Shoulders, Bricolage_Grotesque, Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { AUTHOR, DESCRIPTION, SITE_URL, TITLE } from './lib/site';

// next/font has no fallback metrics for Big Shoulders yet.
const display = Big_Shoulders({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-display',
  adjustFontFallback: false,
});
const text = Bricolage_Grotesque({ subsets: ['latin'], axes: ['opsz', 'wdth'], variable: '--font-text' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const fraunces = Fraunces({ subsets: ['latin'], axes: ['opsz'], variable: '--font-fraunces', preload: false });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', preload: false });

// Set in Vercel → Settings → Environment Variables. Analytics stays off where it's unset.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: '%s · glyphfill' },
  description: DESCRIPTION,
  applicationName: 'glyphfill',
  keywords: [
    'glyphfill',
    'progress',
    'progress bar',
    'loading indicator',
    'variable font',
    'font weight',
    'typography',
    'React',
    'Vue',
    'Svelte',
    'Tailwind CSS',
    'npm package',
  ],
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  creator: AUTHOR.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'glyphfill',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e7f0eb' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1f1a' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${text.variable} ${mono.variable} ${fraunces.variable} ${inter.variable}`}
    >
      <body>{children}</body>
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </html>
  );
}
