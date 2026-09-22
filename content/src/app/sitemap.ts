import type { MetadataRoute } from 'next';
import { staticRoutes } from '@/content/navigation';
import { getSolutions } from '@/lib/content';
import { absoluteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const solutions = await getSolutions();
  return [
    ...staticRoutes,
    ...solutions.map((s) => ({ path: s.href, priority: 0.8 })),
  ].map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: route.priority,
  }));
}
