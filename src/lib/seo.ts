import type { Metadata } from 'next';
import { site } from '@/content/site';
import { isIndexable } from '@/lib/indexing';

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
    // Sempre explícito: um valor undefined aqui apagaria a regra do layout raiz
    // e as prévias de deploy ficariam sem noindex.
    robots: !isIndexable
      ? { index: false, follow: false }
      : index
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}
