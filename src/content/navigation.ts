/**
 * Navegação principal e rotas publicadas.
 * Cases só aparece quando existirem 2–3 cases autorizados (briefing §25).
 */
export const features = {
  showCases: false,
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: 'Início', href: '/' },
  { label: 'A Fuse', href: '/sobre' },
  { label: 'Soluções', href: '/solucoes' },
  ...(features.showCases ? [{ label: 'Cases', href: '/cases' }] : []),
  { label: 'Contato', href: '/contato' },
];

/**
 * Páginas fixas publicadas (alimentam o sitemap).
 * As páginas de solução entram automaticamente a partir do conteúdo.
 * Adicionar cada página aqui quando ela for ao ar.
 */
export const staticRoutes: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/sobre', priority: 0.8 },
  { path: '/solucoes', priority: 0.9 },
  { path: '/contato', priority: 0.9 },
  { path: '/politica-de-privacidade', priority: 0.5 },
];
