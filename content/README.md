# Site Fuse — hubfuse.com.br

Site institucional da Fuse. **Pensamos estratégia. Entregamos resultado.**

## Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilo | CSS Modules + tokens em CSS nativo (`src/styles/tokens.css`) |
| Fonte | Manrope variável, self-hosted (`@fontsource-variable/manrope` + `next/font/local`) |
| Imagens | `next/image` (AVIF/WebP automático, lazy-loading) |
| Animações | CSS puro; JS mínimo só na linha de fusão e no reveal |
| Conteúdo | Keystatic (painel em `/keystatic`, conteúdo em YAML no repositório) |
| Renderização | Estática com ISR (revalidação de 1h) |
| Deploy | Vercel |

## Como rodar localmente

Requisitos: Node.js 20.9+ (recomendado 22).

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run typecheck  # checagem de tipos
```

## Deploy (Vercel)

1. Suba o repositório no GitHub.
2. Na Vercel: **Add New → Project →** importe o repositório (framework detectado automaticamente).
3. Em **Settings → Environment Variables**, cadastre `NEXT_PUBLIC_SITE_URL=https://hubfuse.com.br`.
4. Em **Settings → Domains**, adicione `hubfuse.com.br` e `www.hubfuse.com.br` e defina o redirect de `www` → domínio sem www.
5. No Cloudflare (DNS), aponte os registros conforme a Vercel indicar. Use proxy **desligado** (nuvem cinza) nos registros da Vercel.

Previews da Vercel ficam automaticamente com `noindex` e `robots.txt` bloqueado.

## Painel de conteúdo (Keystatic)

Tudo o que é texto no site é editável em **`/keystatic`**: Home, página Soluções, as cinco páginas de solução (textos, seções, FAQ, SEO, soluções complementares) e as configurações da Fuse (descrição, contatos, perfis oficiais, liderança).

**Em desenvolvimento:** `npm run dev` e acesse `http://localhost:3000/keystatic`. As alterações são gravadas direto nos arquivos de `/content`.

**Em produção (modo GitHub):**

1. Crie o repositório no GitHub e publique na Vercel.
2. Na Vercel, defina `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` e `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=org/repositorio`.
3. Rode o projeto localmente com essas variáveis e acesse `/keystatic`: o assistente cria o GitHub App e gera `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` e `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. Copie as quatro para a Vercel.
4. No GitHub App criado, adicione a URL de callback de produção: `https://hubfuse.com.br/api/keystatic/github/oauth/callback`.
5. Quem edita precisa de uma conta GitHub com acesso ao repositório.

Cada "Save" no painel vira um commit; a Vercel publica a alteração em ~1 minuto.

**Alternativa sem conta GitHub para a equipe:** modo `cloud` (Keystatic Cloud, gratuito até 3 usuários).

Por segurança, com `NEXT_PUBLIC_KEYSTATIC_STORAGE=local` o painel e sua API ficam desativados em produção (retornam 404).

## Estrutura

```
content/                    # conteúdo editável (gerado/editado pelo Keystatic)
├── settings.yaml           # entidade Fuse: slogan, descrição, contatos, perfis, liderança
├── home.yaml               # Home (inclui o Método, usado também em /sobre)
├── sobre.yaml              # A Fuse
├── contato.yaml            # Contato (textos do formulário, mensagens, WhatsApp)
├── solucoes-pilar.yaml     # página Soluções
└── solucoes/*.yaml         # uma página por solução
keystatic.config.ts         # schema do painel (campos, validações, blocos)
src/
├── app/
│   ├── layout.tsx              # HTML raiz (fonte, metadados globais)
│   ├── (site)/layout.tsx       # moldura do site: header, rodapé, JSON-LD
│   ├── (site)/page.tsx         # Home
│   ├── (site)/sobre/           # A Fuse (método reaproveita o conteúdo da Home)
│   ├── (site)/solucoes/        # pilar + [slug] (template das 5 soluções)
│   ├── (site)/contato/         # formulário de diagnóstico
│   ├── api/lead/               # recebe o formulário → planilha Google
│   ├── keystatic/ + api/keystatic/  # painel de conteúdo
│   ├── not-found.tsx           # 404
│   ├── robots.ts, sitemap.ts, llms.txt/route.ts
│   └── icon.svg
├── components/
│   ├── brand/      # Logo (gradiente oficial)
│   ├── layout/     # Header, Footer, SiteShell
│   ├── ui/         # ButtonLink, LinkFuse, EditorialSection, PageHero, Breadcrumbs
│   ├── home/       # seções da Home (+ FusionSteps, elemento signature)
│   ├── solutions/  # SolutionList, SolutionSections (blocos do painel)
│   ├── motion/     # reveal de títulos
│   └── seo/        # JsonLd
├── content/        # constantes estruturais (URL, CTA principal, menu, rotas)
├── lib/
│   ├── content.ts  # leitura do Keystatic — única porta de entrada do conteúdo
│   ├── seo.ts      # buildMetadata(): canonical, OG, X
│   └── schema.ts   # JSON-LD: Organization, WebSite, WebPage, Service, FAQPage, Breadcrumb
└── styles/tokens.css
```

## Formulário de contato

Envia para uma planilha Google e dispara e-mail de aviso. Configuração completa em **`docs/leads-planilha.md`** (~15 minutos).

- Antispam: honeypot + tempo mínimo (sempre ativos) + Cloudflare Turnstile (opcional).
- Origem do lead: UTMs, gclid/fbclid, página de entrada e referrer (primeiro e último toque, 90 dias).
- `/contato?interesse=<slug>` pré-seleciona a solução.
- Eventos no `dataLayer`: `form_start`, `generate_lead`, `form_error`, `whatsapp_click`, `cta_click`.

## O que continua no código (não no painel)

- Menu, CTA principal ("Agendar diagnóstico"), flag de Cases: `src/content/navigation.ts` e `src/content/site.ts`
- Páginas fixas no sitemap: `staticRoutes` em `src/content/navigation.ts` (soluções entram automaticamente)
- Redirects 301: `next.config.ts`

## Decisões técnicas

- **React 19:** exigido pelo App Router a partir do Next 15.
- **Keystatic com conteúdo em YAML no repositório:** sem banco de dados nem serviço pago; histórico de cada alteração no Git; o build falha se um conteúdo obrigatório sumir, então nunca vai ao ar página vazia.
- **Páginas de solução por blocos:** cada solução monta suas seções no painel com 4 tipos de bloco (lista de serviços, processo, lista simples, texto em destaque). Uma única página-modelo atende as cinco frentes.
- **CTA das soluções leva o contexto:** `/contato?interesse=<solução>` para pré-selecionar o campo no formulário.
- **Manrope via npm, não Google Fonts:** zero request externo, sem risco de build falhar e melhor LCP.
- **Sem JS, o site funciona inteiro:** a classe `.js` só é adicionada no navegador; animações de entrada nunca escondem conteúdo de buscadores/LLMs.
- **Uma cor funcional:** o verde oficial é a cor de botão e foco. O roxo fica restrito a gradientes e textos grandes (contraste insuficiente em texto pequeno sobre o preto).
- **Gradiente oficial é imutável:** `--gradient-fuse` (#9933FF → #4D7FEA → #00E5A0, esquerda → direita). Nunca redefinir por componente.
- **JSON-LD só com dados reais:** campos `undefined` são omitidos automaticamente.

## Pendências de conteúdo

- [ ] Logo oficial em SVG (o atual é vetorizado do PNG — `src/components/brand/logo-path.ts`)
- [ ] Ícone oficial (favicon) — `src/app/icon.svg`
- [ ] E-mail comercial público e perfis oficiais — painel → Configurações da Fuse
- [ ] Liderança (opcional): preencher em Configurações da Fuse → Liderança e ligar "Exibir seção de liderança" em A Fuse (Sobre)
- [ ] Configurar planilha de leads — `docs/leads-planilha.md`
- [ ] Política de Privacidade (o formulário já aponta para `/politica-de-privacidade`)
- [ ] Cases autorizados
