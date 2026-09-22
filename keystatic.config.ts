/**
 * Keystatic — painel de conteúdo da Fuse (/keystatic).
 *
 * O conteúdo fica em arquivos YAML dentro do repositório (pasta /content).
 * Editar no painel = um commit no GitHub = novo deploy automático na Vercel.
 *
 * Modos de armazenamento (variável NEXT_PUBLIC_KEYSTATIC_STORAGE):
 *   local  → desenvolvimento; grava direto nos arquivos (padrão)
 *   github → produção; login com conta GitHub com acesso ao repositório
 *   cloud  → produção; login pelo Keystatic Cloud (sem conta GitHub para a equipe)
 */
import { collection, config, fields, singleton } from '@keystatic/core';

const storageKind = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE ?? 'local';

const storage =
  storageKind === 'github'
    ? { kind: 'github' as const, repo: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` }
    : storageKind === 'cloud'
      ? { kind: 'cloud' as const }
      : { kind: 'local' as const };

/* ---------- Campos reutilizáveis ---------- */

const required = (label: string, opts: { multiline?: boolean; description?: string } = {}) =>
  fields.text({ label, multiline: opts.multiline, description: opts.description, validation: { length: { min: 1 } } });

const seoFields = fields.object(
  {
    title: fields.text({
      label: 'SEO title',
      description: 'Até ~60 caracteres. Único por página.',
      validation: { length: { min: 1, max: 70 } },
    }),
    description: fields.text({
      label: 'Meta description',
      description: 'Até ~160 caracteres. Única por página.',
      multiline: true,
      validation: { length: { min: 1, max: 170 } },
    }),
  },
  { label: 'SEO' },
);

const paragraphs = (label: string) =>
  fields.array(required('Parágrafo', { multiline: true }), { label, itemLabel: (p) => p.value.slice(0, 60) });

const stringList = (label: string, itemLabel = 'Item') =>
  fields.array(required(itemLabel), { label, itemLabel: (p) => p.value });

const faqField = fields.array(
  fields.object({
    question: required('Pergunta'),
    answer: required('Resposta', { multiline: true }),
  }),
  { label: 'Perguntas frequentes', itemLabel: (p) => p.fields.question.value },
);

/* ---------- Blocos das páginas de solução ---------- */

const solutionSections = fields.blocks(
  {
    offerings: {
      label: 'Lista de serviços (título + descrição)',
      itemLabel: (p) => p.fields.heading.value,
      schema: fields.object({
        heading: required('Título da seção'),
        items: fields.array(
          fields.object({ title: required('Serviço'), text: required('Descrição', { multiline: true }) }),
          { label: 'Serviços', itemLabel: (p) => p.fields.title.value },
        ),
      }),
    },
    steps: {
      label: 'Processo (etapas numeradas)',
      itemLabel: (p) => p.fields.heading.value,
      schema: fields.object({
        heading: required('Título da seção'),
        items: stringList('Etapas', 'Etapa'),
      }),
    },
    list: {
      label: 'Lista simples',
      itemLabel: (p) => p.fields.heading.value,
      schema: fields.object({
        heading: required('Título da seção'),
        intro: fields.text({ label: 'Introdução (opcional)', multiline: true }),
        items: stringList('Itens'),
      }),
    },
    statement: {
      label: 'Texto em destaque',
      itemLabel: (p) => p.fields.heading.value,
      schema: fields.object({
        heading: required('Título'),
        paragraphs: paragraphs('Parágrafos'),
      }),
    },
  },
  { label: 'Seções da página' },
);

export default config({
  storage,
  ui: {
    brand: { name: 'Fuse' },
    navigation: {
      Páginas: ['home', 'about', 'solutionsPage', 'contact'],
      Soluções: ['solutions'],
      Configurações: ['settings'],
    },
  },

  singletons: {
    /* ---------- Configurações gerais / entidade Fuse ---------- */
    settings: singleton({
      label: 'Configurações da Fuse',
      path: 'content/settings',
      format: { data: 'yaml' },
      schema: {
        slogan: required('Slogan'),
        description: required('Descrição institucional', {
          multiline: true,
          description: 'Usada em SEO, dados estruturados e /llms.txt.',
        }),
        areaServed: required('Área de atendimento'),
        email: fields.text({ label: 'E-mail comercial', description: 'Deixe vazio até confirmar — campos vazios não aparecem no site.' }),
        whatsapp: fields.text({ label: 'WhatsApp', description: 'Somente números, com DDI e DDD. Ex.: 5511999999999' }),
        sameAs: fields.array(fields.url({ label: 'URL do perfil', validation: { isRequired: true } }), {
          label: 'Perfis oficiais (LinkedIn, Instagram…)',
          itemLabel: (p) => p.value ?? '',
        }),
        leadership: fields.array(
          fields.object({
            name: required('Nome'),
            role: required('Cargo'),
            bio: fields.text({ label: 'Biografia', multiline: true, description: 'Aparece na página Sobre. Vazio = só nome e cargo.' }),
            photo: fields.image({
              label: 'Foto profissional',
              description: 'JPG ou WebP, proporção 4:5, mínimo 800 px de largura.',
              directory: 'public/images/equipe',
              publicPath: '/images/equipe/',
            }),
            linkedin: fields.url({ label: 'LinkedIn' }),
          }),
          { label: 'Liderança', itemLabel: (p) => p.fields.name.value },
        ),
      },
    }),

    /* ---------- Home ---------- */
    home: singleton({
      label: 'Home',
      path: 'content/home',
      format: { data: 'yaml' },
      schema: {
        seo: seoFields,
        hero: fields.object(
          {
            eyebrow: required('Linha de apoio (acima do título)'),
            titleLead: required('Título — primeira linha'),
            titleFused: required('Título — segunda linha (gradiente)'),
            text: required('Texto de apoio', { multiline: true }),
            footnote: required('Nota de rodapé do hero'),
          },
          { label: 'Hero' },
        ),
        problem: fields.object(
          {
            label: required('Rótulo'),
            title: required('Título'),
            paragraphs: paragraphs('Parágrafos'),
            closingBefore: required('Fechamento — antes do destaque'),
            closingHighlight: required('Fechamento — trecho em destaque'),
            closingAfter: required('Fechamento — depois do destaque'),
          },
          { label: 'O problema' },
        ),
        whatWeDo: fields.object(
          { label: required('Rótulo'), title: required('Título'), intro: required('Introdução', { multiline: true }) },
          { label: 'O que fazemos' },
        ),
        method: fields.object(
          {
            label: required('Rótulo'),
            title: required('Título'),
            paragraphs: paragraphs('Parágrafos'),
            steps: fields.array(
              fields.object({ title: required('Etapa'), text: required('Descrição', { multiline: true }) }),
              { label: 'Etapas (ideal: 4)', itemLabel: (p) => p.fields.title.value },
            ),
            ctaLabel: required('Texto do link'),
          },
          { label: 'Método' },
        ),
        differential: fields.object(
          {
            label: required('Rótulo'),
            title: required('Título'),
            intro: required('Introdução', { multiline: true }),
            principles: stringList('Princípios', 'Princípio'),
          },
          { label: 'Diferencial' },
        ),
        fit: fields.object(
          {
            label: required('Rótulo'),
            title: required('Título'),
            intro: required('Introdução'),
            items: stringList('Itens'),
          },
          { label: 'Para quem faz sentido' },
        ),
        faq: fields.object({ label: required('Rótulo'), title: required('Título'), items: faqField }, { label: 'FAQ' }),
        finalCta: fields.object(
          { title: required('Título'), text: required('Texto', { multiline: true }) },
          { label: 'CTA final' },
        ),
      },
    }),

    /* ---------- Sobre ---------- */
    about: singleton({
      label: 'A Fuse (Sobre)',
      path: 'content/sobre',
      format: { data: 'yaml' },
      schema: {
        seo: seoFields,
        title: required('Título (H1)'),
        intro: paragraphs('Introdução'),
        purpose: fields.object(
          {
            label: required('Rótulo'),
            title: required('Título'),
            paragraphs: paragraphs('Parágrafos'),
            closing: required('Frase de fechamento', { multiline: true }),
          },
          { label: 'Por que a Fuse existe' },
        ),
        thinking: fields.object(
          {
            label: required('Rótulo'),
            title: required('Título'),
            paragraphs: paragraphs('Parágrafos'),
            principlesTitle: required('Título dos princípios'),
            principles: stringList('Princípios', 'Princípio'),
          },
          { label: 'Como pensamos' },
        ),
        presence: fields.object(
          { label: required('Rótulo'), title: required('Título'), text: required('Texto', { multiline: true }) },
          { label: 'Onde atuamos' },
        ),
        showLeadership: fields.checkbox({
          label: 'Exibir seção de liderança',
          description: 'Nome, cargo, bio e LinkedIn vêm de Configurações da Fuse → Liderança.',
          defaultValue: false,
        }),
        leadershipLabel: required('Rótulo — liderança'),
        leadershipTitle: required('Título — liderança'),
        ctaTitle: required('CTA — título'),
        ctaLabel: required('CTA — texto do botão'),
      },
    }),

    /* ---------- Contato ---------- */
    contact: singleton({
      label: 'Contato',
      path: 'content/contato',
      format: { data: 'yaml' },
      schema: {
        seo: seoFields,
        title: required('Título (H1)'),
        intro: paragraphs('Introdução'),
        supportText: required('Texto de apoio ao formulário', { multiline: true }),
        challengePlaceholder: required('Exemplo no campo "Principal desafio"'),
        howFoundOptions: stringList('Opções de "Como conheceu a Fuse?"', 'Opção'),
        consentText: required('Texto do consentimento (LGPD)', { multiline: true }),
        submitLabel: required('Texto do botão'),
        successTitle: required('Sucesso — título'),
        successMessage: required('Sucesso — mensagem', { multiline: true }),
        errorMessage: required('Mensagem de erro', { multiline: true }),
        whatsappTitle: required('WhatsApp — chamada'),
        whatsappMessage: required('WhatsApp — mensagem inicial pré-preenchida', { multiline: true }),
        regionText: required('Informação regional'),
        closingLine: required('Frase final', { multiline: true }),
      },
    }),

    /* ---------- Página-pilar Soluções ---------- */
    solutionsPage: singleton({
      label: 'Soluções (página-pilar)',
      path: 'content/solucoes-pilar',
      format: { data: 'yaml' },
      schema: {
        seo: seoFields,
        title: required('Título (H1)'),
        intro: paragraphs('Introdução'),
        chooseTitle: required('Título — como escolher'),
        chooseParagraphs: paragraphs('Como escolher a frente certa'),
        ctaTitle: required('CTA — título'),
        ctaText: required('CTA — texto', { multiline: true }),
      },
    }),

    /* ---------- Política de Privacidade ---------- */
    privacyPolicy: singleton({
      label: 'Política de Privacidade',
      path: 'content/politica-de-privacidade',
      format: { data: 'yaml' },
      schema: {
        seo: seoFields,
        title: required('Título (H1)'),
        lastUpdated: required('Data da última atualização', { description: 'Ex: 22 de setembro de 2026' }),
        intro: required('Introdução', { multiline: true }),
        sections: fields.array(
          fields.object({
            id: required('ID da seção', { description: 'Slug único, ex: dados-que-coletamos' }),
            title: required('Título'),
            content: fields.text({ label: 'Conteúdo', multiline: true }),
            subsections: fields.array(
              fields.object({
                title: required('Título da subseção'),
                content: required('Conteúdo', { multiline: true }),
              }),
              { label: 'Subseções' },
            ),
          }),
          { label: 'Seções', itemLabel: (s) => s.fields.title.value },
        ),
      },
    }),
  },

  collections: {
    /* ---------- As cinco frentes ---------- */
    solutions: collection({
      label: 'Soluções',
      path: 'content/solucoes/*',
      slugField: 'name',
      format: { data: 'yaml' },
      columns: ['name', 'order'],
      schema: {
        name: fields.slug({
          name: { label: 'Nome da solução' },
          slug: { label: 'URL', description: 'Não altere após publicar sem criar um redirect 301.' },
        }),
        order: fields.integer({ label: 'Ordem de exibição', defaultValue: 1, validation: { isRequired: true } }),
        summary: required('Resumo (Home)', { multiline: true }),
        pillarSummary: required('Resumo (página Soluções)', { multiline: true }),
        linkLabel: required('Texto do link (ex.: Conhecer Estratégia)'),
        seo: seoFields,
        title: required('Título da página (H1)'),
        intro: paragraphs('Introdução'),
        sections: solutionSections,
        ctaTitle: required('CTA — título'),
        ctaLabel: required('CTA — texto do botão'),
        faq: faqField,
        related: fields.array(
          fields.relationship({ label: 'Solução', collection: 'solutions', validation: { isRequired: true } }),
          { label: 'Soluções complementares', itemLabel: (p) => p.value ?? '' },
        ),
      },
    }),
  },
});
