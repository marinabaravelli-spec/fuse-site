import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { PlainText } from '@/components/ui/PlainText';
import { getPrivacyPolicyContent } from '@/lib/content';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const revalidate = 3600;

const PATH = '/politica-de-privacidade';

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPrivacyPolicyContent();
  return buildMetadata({ ...seo, path: PATH });
}

/** Parágrafos separados por linha em branco (introdução do painel). */
const splitParagraphs = (text: string) =>
  text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export default async function PrivacyPolicyPage() {
  const policy = await getPrivacyPolicyContent();
  const crumbs = [
    { name: 'Início', path: '/' },
    { name: policy.title, path: PATH },
  ];

  return (
    <>
      <JsonLd data={[webPageSchema({ ...policy.seo, path: PATH, type: 'WebPage' }), breadcrumbSchema(crumbs)]} />

      <PageHero breadcrumbs={crumbs} title={policy.title} intro={splitParagraphs(policy.intro)} />

      <section className={styles.doc} aria-label={policy.title}>
        <div className="container">
          <div className={styles.layout}>
            {/* Sumário: só no desktop, fixo ao rolar */}
            <nav className={styles.toc} aria-labelledby="toc-title">
              <p id="toc-title" className={styles.tocTitle}>Nesta página</p>
              <ol>
                {policy.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className={styles.body}>
              <p className={styles.updated}>Última atualização: {policy.lastUpdated}</p>

              {policy.sections.map((section) => (
                <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className={styles.block}>
                  <h2 id={`${section.id}-title`} className={styles.h2}>{section.title}</h2>

                  {section.content && (
                    <PlainText text={section.content} paragraphClassName={styles.p} listClassName={styles.list} />
                  )}

                  {section.subsections.map((sub) => (
                    <div key={sub.title} className={styles.sub}>
                      <h3 className={styles.h3}>{sub.title}</h3>
                      <PlainText text={sub.content} paragraphClassName={styles.p} listClassName={styles.list} />
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
