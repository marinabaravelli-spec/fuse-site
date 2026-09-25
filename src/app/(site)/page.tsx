import type { Metadata } from 'next';
import { Clients } from '@/components/home/Clients';
import { Differential } from '@/components/home/Differential';
import { Faq } from '@/components/home/Faq';
import { FinalCta } from '@/components/home/FinalCta';
import { Fit } from '@/components/home/Fit';
import { Hero } from '@/components/home/Hero';
import { Method } from '@/components/home/Method';
import { Problem } from '@/components/home/Problem';
import { Solutions } from '@/components/home/Solutions';
import { JsonLd } from '@/components/seo/JsonLd';
import { getHomeContent, getSolutions } from '@/lib/content';
import { faqPageSchema, webPageSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomeContent();
  return buildMetadata({ ...seo, path: '/' });
}

export default async function HomePage() {
  const [home, solutions] = await Promise.all([getHomeContent(), getSolutions()]);

  return (
    <>
      <JsonLd data={[webPageSchema({ ...home.seo, path: '/' }), faqPageSchema(home.faq.items)]} />
      <Hero content={home.hero} />
      <Problem content={home.problem} />
      <Solutions content={home.whatWeDo} solutions={solutions} />
      <Method content={home.method} />
      <Clients />
      <Differential content={home.differential} />
      <Fit content={home.fit} />
      {/* Cases: entra aqui quando features.showCases = true */}
      <Faq label={home.faq.label} title={home.faq.title} items={home.faq.items} />
      <FinalCta title={home.finalCta.title} text={home.finalCta.text} />
    </>
  );
}
