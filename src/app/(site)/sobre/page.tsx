import type { Metadata } from 'next';
import { Leadership } from '@/components/about/Leadership';
import { FinalCta } from '@/components/home/FinalCta';
import { Method } from '@/components/home/Method';
import { JsonLd } from '@/components/seo/JsonLd';
import { EditorialSection } from '@/components/ui/EditorialSection';
import { LinkFuse } from '@/components/ui/LinkFuse';
import { PageHero } from '@/components/ui/PageHero';
import { getAboutContent, getHomeContent, getSettings } from '@/lib/content';
import { breadcrumbSchema, peopleSchema, webPageSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAboutContent();
  return buildMetadata({ ...seo, path: '/sobre' });
}

export default async function AboutPage() {
  const [about, home, settings] = await Promise.all([getAboutContent(), getHomeContent(), getSettings()]);
  const crumbs = [
    { name: 'Início', path: '/' },
    { name: 'A Fuse', path: '/sobre' },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ ...about.seo, path: '/sobre', type: 'AboutPage' }),
          breadcrumbSchema(crumbs),
          ...(about.showLeadership ? peopleSchema(settings.leadership) : []),
        ]}
      />

      <PageHero breadcrumbs={crumbs} title={about.title} intro={about.intro} />

      {/* Por que a Fuse existe */}
      <EditorialSection label={about.purpose.label} titleId="proposito-title" tone="paper">
        <h2 id="proposito-title" className="title-2" data-reveal>{about.purpose.title}</h2>
        <div className={styles.paperText}>
          {about.purpose.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
        <p className={styles.closing}>{about.purpose.closing}</p>
      </EditorialSection>

      {/* Como pensamos + princípios */}
      <EditorialSection label={about.thinking.label} titleId="como-pensamos-title">
        <h2 id="como-pensamos-title" className="title-2" data-reveal>{about.thinking.title}</h2>
        {about.thinking.paragraphs.map((p) => <p key={p} className={`lead ${styles.paragraph}`}>{p}</p>)}
        <h3 className={styles.principlesTitle}>{about.thinking.principlesTitle}</h3>
        <ul className={styles.principles}>
          {about.thinking.principles.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </EditorialSection>

      {/* Método — mesmo conteúdo da Home (editar em Home → Método). Âncora #metodo. */}
      <Method content={home.method} showCta={false} />

      {/* Liderança: desligada por padrão. Ativar no painel → A Fuse (Sobre) → "Exibir seção de liderança". */}
      {about.showLeadership && settings.leadership.length > 0 && (
        <Leadership label={about.leadershipLabel} title={about.leadershipTitle} people={settings.leadership} />
      )}

      {/* Onde atuamos */}
      <EditorialSection label={about.presence.label} titleId="presenca-title" flushTop={about.showLeadership}>
        <h2 id="presenca-title" className="title-2" data-reveal>{about.presence.title}</h2>
        <p className={`lead ${styles.paragraph}`}>{about.presence.text}</p>
        <div className={styles.links}>
          <LinkFuse href="/solucoes">Conheça nossas soluções</LinkFuse>
        </div>
      </EditorialSection>

      <FinalCta title={about.ctaTitle} buttonLabel={about.ctaLabel} />
    </>
  );
}
