/**
 * Camada de acesso a conteúdo — lê os arquivos editados pelo Keystatic (/content).
 * Componentes e páginas só conversam com estas funções.
 */
import 'server-only';
import { cache } from 'react';
import { createReader } from '@keystatic/core/reader';
import type { Entry } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

export type Settings = Entry<(typeof keystaticConfig)['singletons']['settings']>;
export type HomeContent = Entry<(typeof keystaticConfig)['singletons']['home']>;
export type AboutContent = Entry<(typeof keystaticConfig)['singletons']['about']>;
export type ContactContent = Entry<(typeof keystaticConfig)['singletons']['contact']>;
export type SolutionsPageContent = Entry<(typeof keystaticConfig)['singletons']['solutionsPage']>;
export type SolutionEntry = Entry<(typeof keystaticConfig)['collections']['solutions']>;
export type Solution = Omit<SolutionEntry, 'name'> & { slug: string; name: string; href: string };
export type FaqItem = { question: string; answer: string };

/** Falha no build se um conteúdo obrigatório sumir — nunca publica página vazia. */
function ensure<T>(value: T | null, what: string): T {
  if (!value) throw new Error(`[conteúdo] "${what}" não encontrado em /content.`);
  return value;
}

export const getSettings = cache(async () => ensure(await reader.singletons.settings.read(), 'settings'));

export const getHomeContent = cache(async () => ensure(await reader.singletons.home.read(), 'home'));

export const getAboutContent = cache(async () => ensure(await reader.singletons.about.read(), 'sobre'));

export const getContactContent = cache(async () => ensure(await reader.singletons.contact.read(), 'contato'));

export const getSolutionsPage = cache(async () =>
  ensure(await reader.singletons.solutionsPage.read(), 'solucoes-pilar'),
);

/** Todas as soluções, na ordem definida no painel. */
export const getSolutions = cache(async (): Promise<Solution[]> => {
  const all = await reader.collections.solutions.all();
  return all
    .map(({ slug, entry }) => ({ ...entry, slug, name: entry.name, href: `/solucoes/${slug}` }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
});

export const getSolution = cache(async (slug: string) => {
  const solutions = await getSolutions();
  return solutions.find((s) => s.slug === slug) ?? null;
});
