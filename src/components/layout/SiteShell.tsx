import { Footer } from '@/components/layout/Footer/Footer';
import { Header } from '@/components/layout/Header/Header';
import { ClientEnhancements } from '@/components/motion/ClientEnhancements';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSettings, getSolutions } from '@/lib/content';
import { organizationSchema, websiteSchema } from '@/lib/schema';

/** Moldura do site público: skip link, header, main, rodapé e JSON-LD da entidade. */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [settings, solutions] = await Promise.all([getSettings(), getSolutions()]);
  return (
    <>
      <JsonLd data={[organizationSchema(settings, solutions), websiteSchema()]} />
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer settings={settings} solutions={solutions} />
      <ClientEnhancements />
    </>
  );
}
