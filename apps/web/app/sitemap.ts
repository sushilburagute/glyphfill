import type { MetadataRoute } from 'next';
import { SITE_URL } from './lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/llms.txt`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/llms-full.txt`, changeFrequency: 'monthly', priority: 0.3 },
  ];
}
