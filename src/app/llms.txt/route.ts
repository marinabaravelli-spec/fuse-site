/**
 * /llms.txt — resumo factual da Fuse para sistemas de IA (briefing §33–36).
 *
 * Tudo aqui vem do mesmo conteúdo que aparece no site (painel Keystatic +
 * lista de clientes), para o arquivo nunca contradizer as páginas.
 * Formato: proposta llmstxt.org (título, resumo em citação, seções com links).
 */
import { clients } from '@/content/clients';
import { site } from '@/content/site';
import { getAboutContent, getContactContent, getHomeContent, getSettings, getSolutions } from '@/lib/content';
import { absoluteUrl } from '@/lib/seo';
import { formatBrazilianPhone, whatsappUrl } from '@/lib/whatsapp';

export const dynamic = 'force-static';

const list = (items: readonly string[]) => items.map((item) => `- ${item}`).join('\n');

export async function GET() {
  const [settings, solutions, home, about, contact] = await Promise.all([
    getSettings(),
    getSolutions(),
    getHomeContent(),
    getAboutContent(),
    getContactContent(),
  ]);

  const contactLines = [
    `- Formulário de diagnóstico: ${absoluteUrl('/contato')}`,
    settings.whatsapp && `- WhatsApp: ${formatBrazilianPhone(settings.whatsapp)} (${whatsappUrl(settings.whatsapp)})`,
    settings.email && `- E-mail: ${settings.email}`,
  ].filter(Boolean);

  const sections = [
    `# ${site.name}`,

    `> ${settings.description}`,

    `Slogan: ${settings.slogan}\n${settings.areaServed}`,

    `## Soluções\n${solutions.map((s) => `- [${s.name}](${absoluteUrl(s.href)}): ${s.summary}`).join('\n')}`,

    `## Como a Fuse trabalha\n${home.method.paragraphs.join(' ')}\n\n${home.method.steps
      .map((step, i) => `${i + 1}. ${step.title}: ${step.text}`)
      .join('\n')}`,

    `## Diferencial\n${home.differential.title}\n\n${list(home.differential.principles)}`,

    `## Para quem a Fuse faz sentido\n${home.fit.intro}\n\n${list(home.fit.items)}`,

    `## Onde a Fuse atende\n${about.presence.text}`,

    `## Clientes\nEmpresas que já trabalharam com a Fuse: ${clients.map((c) => c.name).join(', ')}.`,

    `## Perguntas frequentes\n${home.faq.items.map((f) => `### ${f.question}\n${f.answer}`).join('\n\n')}`,

    `## Como contratar\n${contact.supportText}\n\n${contactLines.join('\n')}`,

    `## Páginas principais\n${[
      `- [Início](${absoluteUrl('/')})`,
      `- [A Fuse](${absoluteUrl('/sobre')})`,
      `- [Soluções](${absoluteUrl('/solucoes')})`,
      ...solutions.map((s) => `- [${s.name}](${absoluteUrl(s.href)})`),
      `- [Contato](${absoluteUrl('/contato')})`,
    ].join('\n')}`,

    `## Optional\n- [Política de Privacidade](${absoluteUrl('/politica-de-privacidade')})${
      settings.sameAs.length ? `\n${settings.sameAs.map((url) => `- Perfil oficial: ${url}`).join('\n')}` : ''
    }`,
  ];

  return new Response(`${sections.join('\n\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
