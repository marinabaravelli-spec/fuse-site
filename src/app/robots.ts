import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  // Previews: bloqueia tudo. Produção: libera o site, bloqueia painel e API.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/keystatic'] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
