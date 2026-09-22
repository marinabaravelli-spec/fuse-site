import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
        ],
      },
    ];
  },
};

export default nextConfig;
