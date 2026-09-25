import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { isIndexable } from '@/lib/indexing';

export default function robots(): MetadataRoute.Robots {
  // Prévias, deploys de branch e builds locais: bloqueia tudo.
  if (!isIndexable) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  // Produção: libera o site, bloqueia painel e API.
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/keystatic'] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
