/**
 * O site só pode ser indexado no deploy de PRODUÇÃO do Netlify.
 *
 * O Netlify informa o tipo de deploy na variável CONTEXT durante o build:
 *   production     → site oficial (hubfuse.com.br)   → indexável
 *   deploy-preview → prévia de pull request           → noindex
 *   branch-deploy  → deploy de outra branch           → noindex
 *   dev            → netlify dev (local)              → noindex
 * Fora do Netlify (ex.: npm run build no computador), CONTEXT não existe → noindex.
 *
 * O valor é gravado no build via next.config.ts (env.DEPLOY_CONTEXT), então
 * continua valendo quando as páginas são regeneradas (ISR) no servidor.
 */
export const deployContext = process.env.DEPLOY_CONTEXT || 'local';

export const isIndexable = deployContext === 'production';
