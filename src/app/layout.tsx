import type { Metadata, Viewport } from 'next';
import { site } from '@/content/site';
import { isIndexable } from '@/lib/indexing';
import { manrope } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Fuse | Pensamos estratégia. Entregamos resultado.', template: `%s | ${site.name}` },
  applicationName: site.name,
  robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0D0D0D',
};

/** Layout raiz: só o essencial. Header/rodapé ficam em (site)/layout.tsx,
 *  para o painel /keystatic não herdar a navegação do site. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={manrope.variable} suppressHydrationWarning>
      <head>
        {/* Marca "com JS" antes do primeiro paint. Sem JS, todo o conteúdo aparece. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
