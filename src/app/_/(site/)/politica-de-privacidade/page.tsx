import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { EditorialSection } from '@/components/ui/EditorialSection';
import { PageHero } from '@/components/ui/PageHero';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import { getPrivacyPolicyContent } from '@/lib/content';
import styles from './page.module.css';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const politicaContent = await getPrivacyPolicyContent();
  return buildMetadata({
    title: politicaContent.seo.title,
    description: politicaContent.seo.description,
    path: '/politica-de-privacidade',
  });
}

export default async function PoliticaPrivacidadePage() {
  const politicaContent = await getPrivacyPolicyContent();
  const crumbs = [
    { name: 'Início', path: '/' },
    { name: 'Política de Privacidade', path: '/politica-de-privacidade' },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            title: politicaContent.seo.title,
            description: politicaContent.seo.description,
            path: '/politica-de-privacidade',
            type: 'WebPage',
          }),
          breadcrumbSchema(crumbs),
        ]}
      />

      <PageHero breadcrumbs={crumbs} title={politicaContent.title} intro={[]} />

      <EditorialSection label="" titleId="last-updated">
        <p className={styles.lastUpdated}>
          Última atualização: {politicaContent.lastUpdated}
        </p>
      </EditorialSection>

      <EditorialSection label="" titleId="intro">
        <div className={styles.intro}>
          {politicaContent.intro.split('\n\n').map((paragraph: string) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </EditorialSection>

      {politicaContent.sections.map((section: any) => (
        <EditorialSection key={section.id} label="" titleId={section.id}>
          <h2 className={`title-2 ${styles.sectionTitle}`} id={section.id} data-reveal>
            {section.title}
          </h2>

          {section.content && (
            <div className={styles.content}>
              {section.content.split('\n\n').map((block: string, idx: number) => (
                <div key={idx}>
                  {block.split('\n').map((line: string, lineIdx: number) => {
                    if (line.match(/^- /)) {
                      return null;
                    }
                    if (line.match(/^\*\*.*\*\*:/)) {
                      return (
                        <div key={lineIdx} className={styles.strongLine}>
                          {line.replace(/\*\*/g, '')}
                        </div>
                      );
                    }
                    if (line.trim() === '') {
                      return null;
                    }
                    return (
                      <p key={lineIdx} className={styles.paragraph}>
                        {line}
                      </p>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {section.subsections && (
            <div className={styles.subsections}>
              {section.subsections.map((subsection: any) => (
                <div key={subsection.title} className={styles.subsection}>
                  <h3 className={styles.subsectionTitle}>{subsection.title}</h3>
                  <div className={styles.content}>
                    {subsection.content.split('\n\n').map((block: string, idx: number) => (
                      <div key={idx}>
                        {block.split('\n').map((line: string, lineIdx: number) => {
                          if (line.match(/^- /)) {
                            return (
                              <li key={lineIdx} className={styles.listItem}>
                                {line.replace(/^- /, '')}
                              </li>
                            );
                          }
                          if (line.match(/^\*\*.*\*\*:/)) {
                            return (
                              <div key={lineIdx} className={styles.strongLine}>
                                {line.replace(/\*\*/g, '')}
                              </div>
                            );
                          }
                          if (line.trim() === '') {
                            return null;
                          }
                          return (
                            <p key={lineIdx} className={styles.paragraph}>
                              {line}
                            </p>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </EditorialSection>
      ))}
    </>
  );
}
