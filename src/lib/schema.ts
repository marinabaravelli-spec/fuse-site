/**
 * Dados estruturados (JSON-LD). Regra do briefing §32:
 * só informações verdadeiras e visíveis no site — campos vazios são omitidos.
 */
import { site } from '@/content/site';
import type { FaqItem, Settings, Solution } from '@/lib/content';
import { absoluteUrl } from '@/lib/seo';

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

/** Remove chaves vazias (undefined, '' e arrays vazios) */
function clean<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)),
  ) as T;
}

export function organizationSchema(settings: Settings, solutions: Solution[]) {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.svg`, // TODO: logo oficial em PNG/SVG quadrado
    slogan: settings.slogan,
    description: settings.description,
    email: settings.email || undefined,
    telephone: settings.whatsapp ? `+${settings.whatsapp}` : undefined,
    areaServed: { '@type': 'Country', name: 'Brasil' },
    sameAs: settings.sameAs.filter(Boolean),
    knowsAbout: solutions.map((s) => s.name),
  });
}

/** Pessoas da liderança — usar só na página em que a seção estiver visível */
export function peopleSchema(people: Settings['leadership']) {
  return people.map((p) =>
    clean({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: p.name,
      jobTitle: p.role,
      description: p.bio || undefined,
      image: p.photo ? `${site.url}${p.photo}` : undefined,
      sameAs: p.linkedin ? [p.linkedin] : undefined,
      worksFor: { '@id': ORG_ID },
    }),
  );
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: site.url,
    name: site.name,
    inLanguage: site.language,
    publisher: { '@id': ORG_ID },
  };
}

export function webPageSchema({
  path,
  title,
  description,
  type = 'WebPage',
}: {
  path: string;
  title: string;
  description: string;
  type?: 'WebPage' | 'AboutPage' | 'ContactPage';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: site.language,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
  };
}

/** Serviço oferecido pela Fuse (páginas de solução) */
export function serviceSchema(solution: Solution) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${absoluteUrl(solution.href)}#service`,
    name: solution.name,
    serviceType: solution.name,
    description: solution.seo.description,
    url: absoluteUrl(solution.href),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Brasil' },
  };
}

/** Só usar em páginas que exibem as perguntas e respostas */
export function faqPageSchema(items: readonly FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
