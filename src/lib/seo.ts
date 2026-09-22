import type { Metadata } from 'next';
import { site } from '@/content/site';

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** false para páginas que não devem ser indexadas */
  index?: boolean;
};

export const absoluteUrl = (path = '/') => (path === '/' ? site.url : `${site.url}${path}`);

/** Metadados completos por página: title, description, canonical, Open Graph e X. */
export function buildMetadata({ title, description, path, index = true }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description, siteName: site.name, locale: site.locale },
    twitter: { card: 'summary_large_image', title, description },
    robots: index ? undefined : { index: false, follow: true },
  };
}
