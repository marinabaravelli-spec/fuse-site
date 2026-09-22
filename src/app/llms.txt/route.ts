/**
 * /llms.txt — resumo factual da Fuse para sistemas de IA (briefing §36).
 * Gerado a partir do mesmo conteúdo do site para nunca ficar desatualizado.
 */
import { site } from '@/content/site';
import { getSettings, getSolutions } from '@/lib/content';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export async function GET() {
  const [settings, solutions] = await Promise.all([getSettings(), getSolutions()]);
  const body = `# ${site.name}

> ${settings.slogan}

## O que é a Fuse
${settings.description}

## Principais soluções
${solutions.map((s) => `- [${s.name}](${absoluteUrl(s.href)}): ${s.summary}`).join('\n')}

## Público
Empresas B2B, tecnologia, educação, saúde, serviços profissionais, indústria e negócios com soluções complexas.

## Atendimento
${settings.areaServed}

## Como contratar
O primeiro passo é enviar o contexto da empresa pelo formulário de contato. A Fuse avalia o desafio, a prioridade e a aderência antes de apresentar uma recomendação.

## Páginas principais
- [Home](${absoluteUrl('/')})
- [Soluções](${absoluteUrl('/solucoes')})
${solutions.map((s) => `- [${s.name}](${absoluteUrl(s.href)})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
