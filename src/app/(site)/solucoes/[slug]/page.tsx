import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Faq } from '@/components/home/Faq';
import { FinalCta } from '@/components/home/FinalCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { SolutionList } from '@/components/solutions/SolutionList';
import { SolutionSections } from '@/components/solutions/SolutionSections';
import { EditorialSection } from '@/components/ui/EditorialSection';
import { PageHero } from '@/components/ui/PageHero';
import { getSolution, getSolutions } from '@/lib/content';
import { breadcrumbSchema, faqPageSchema, serviceSchema, webPageSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;
export const dynamicParams = false; // só existem as soluções cadastradas no painel

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const solutions = await getSolutions();
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const solution = await getSolution(slug);
  if (!solution) return {};
  return buildMetadata({ ...solution.seo, path: solution.href });
}

export default async function SolutionPage({ params }: Params) {
  const { slug } = await params;
  const [solution, all] = await Promise.all([getSolution(slug), getSolutions()]);
  if (!solution) notFound();

  const crumbs = [
    { name: 'Início', path: '/' },
    { name: 'Soluções', path: '/solucoes' },
    { name: solution.name, path: solution.href },
  ];
  const related = solution.related
    .map((relatedSlug) => all.find((s) => s.slug === relatedSlug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ ...solution.seo, path: solution.href }),
          serviceSchema(solution),
          breadcrumbSchema(crumbs),
          ...(solution.faq.length ? [faqPageSchema(solution.faq)] : []),
        ]}
      />

      <PageHero breadcrumbs={crumbs} title={solution.title} intro={solution.intro} />
      <SolutionSections sections={solution.sections} />

      {solution.faq.length > 0 && (
        <Faq label="Perguntas frequentes" title={`Dúvidas sobre ${solution.name}.`} items={solution.faq} flushTop={false} />
      )}

      {related.length > 0 && (
        <EditorialSection
          label="Soluções complementares"
          titleId="relacionadas-title"
          flushTop
          after={
            <SolutionList
              compact
              items={related.map((s) => ({ key: s.slug, name: s.name, href: s.href, summary: s.summary, linkLabel: s.linkLabel }))}
            />
          }
        >
          <h2 id="relacionadas-title" className="title-2" data-reveal>Frentes que costumam trabalhar junto.</h2>
        </EditorialSection>
      )}

      <FinalCta title={solution.ctaTitle} buttonLabel={solution.ctaLabel} href={`/contato?interesse=${solution.slug}`} />
    </>
  );
}
