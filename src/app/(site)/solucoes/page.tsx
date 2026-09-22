import type { Metadata } from 'next';
import { FinalCta } from '@/components/home/FinalCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { SolutionList } from '@/components/solutions/SolutionList';
import { EditorialSection } from '@/components/ui/EditorialSection';
import { PageHero } from '@/components/ui/PageHero';
import { getSolutions, getSolutionsPage } from '@/lib/content';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSolutionsPage();
  return buildMetadata({ ...seo, path: '/solucoes' });
}

export default async function SolutionsPillarPage() {
  const [page, solutions] = await Promise.all([getSolutionsPage(), getSolutions()]);
  const crumbs = [
    { name: 'Início', path: '/' },
    { name: 'Soluções', path: '/solucoes' },
  ];

  return (
    <>
      <JsonLd data={[webPageSchema({ ...page.seo, path: '/solucoes' }), breadcrumbSchema(crumbs)]} />

      <PageHero breadcrumbs={crumbs} title={page.title} intro={page.intro} />

      <section className="container" aria-label="Frentes de atuação">
        <SolutionList
          items={solutions.map((s) => ({
            key: s.slug,
            name: s.name,
            href: s.href,
            summary: s.pillarSummary,
            linkLabel: `Explorar ${s.name}`,
          }))}
        />
      </section>

      <EditorialSection label="Como escolher a frente certa" titleId="escolher-title">
        <h2 id="escolher-title" className="title-2" data-reveal>{page.chooseTitle}</h2>
        <div className={styles.choose}>
          {page.chooseParagraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
      </EditorialSection>

      <FinalCta title={page.ctaTitle} text={page.ctaText} />
    </>
  );
}
