/**
 * Constantes estruturais (não editáveis pelo painel).
 * Textos e dados institucionais editáveis ficam em /content (Keystatic).
 */
export const site = {
  name: 'Fuse',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hubfuse.com.br').replace(/\/$/, ''),
  locale: 'pt_BR',
  language: 'pt-BR',
} as const;

export const primaryCta = { label: 'Agendar diagnóstico', href: '/contato' } as const;
