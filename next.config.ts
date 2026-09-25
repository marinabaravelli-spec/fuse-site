import type { NextConfig } from 'next';

// Tipo de deploy do Netlify (production, deploy-preview, branch-deploy…).
// Gravado no build para que robots, meta robots e cabeçalhos usem o mesmo valor.
const deployContext = process.env.CONTEXT || 'local';
const isIndexable = deployContext === 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  env: { DEPLOY_CONTEXT: deployContext },
  poweredByHeader: false,

  images: {
    // Next Image entrega AVIF/WebP automaticamente conforme o navegador
    formats: ['image/avif', 'image/webp'],
  },

  // Redirects 301 de URLs antigas do hubfuse.com.br entram aqui.
  // Ex.: { source: '/servicos', destination: '/solucoes', permanent: true }
  async redirects() {
    return [];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Prévias e deploys de branch: bloqueio de indexação também no cabeçalho HTTP
          // (cobre arquivos que não são HTML, como imagens, llms.txt e sitemap).
          ...(isIndexable ? [] : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
        ],
      },
    ];
  },
};

export default nextConfig;
