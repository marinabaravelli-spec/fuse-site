import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { getContactContent, getSettings, getSolutions } from '@/lib/content';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import { formatBrazilianPhone, whatsappUrl } from '@/lib/whatsapp';
import styles from './page.module.css';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContactContent();
  return buildMetadata({ ...seo, path: '/contato' });
}

export default async function ContactPage() {
  const [contact, settings, solutions] = await Promise.all([getContactContent(), getSettings(), getSolutions()]);
  const crumbs = [
    { name: 'Início', path: '/' },
    { name: 'Contato', path: '/contato' },
  ];
  const whatsappHref = settings.whatsapp ? whatsappUrl(settings.whatsapp, contact.whatsappMessage) : undefined;

  return (
    <>
      <JsonLd data={[webPageSchema({ ...contact.seo, path: '/contato', type: 'ContactPage' }), breadcrumbSchema(crumbs)]} />

      <PageHero breadcrumbs={crumbs} title={contact.title} intro={contact.intro} />

      <section className={styles.section} aria-labelledby="form-title">
        <div className={`container ${styles.layout}`}>
          <aside className={styles.aside}>
            <h2 id="form-title" className={styles.asideTitle}>Diagnóstico estratégico</h2>
            <p className={styles.support}>{contact.supportText}</p>

            {whatsappHref && (
              <div className={styles.whatsapp}>
                <p>{contact.whatsappTitle}</p>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.whatsappLink}>
                  WhatsApp {formatBrazilianPhone(settings.whatsapp)}
                  <span className="visually-hidden"> (abre em nova aba)</span>
                </a>
              </div>
            )}

            <p className={styles.region}>{contact.regionText}</p>
          </aside>

          <div>
            <ContactForm
              interests={[
                ...solutions.map((s) => ({ value: s.name, slug: s.slug })),
                { value: 'Ainda não sei' },
              ]}
              howFoundOptions={contact.howFoundOptions}
              challengePlaceholder={contact.challengePlaceholder}
              consentText={contact.consentText}
              submitLabel={contact.submitLabel}
              successTitle={contact.successTitle}
              successMessage={contact.successMessage}
              errorMessage={contact.errorMessage}
              whatsappHref={whatsappHref ?? '/contato'}
            />
          </div>
        </div>
      </section>

      <section className={styles.closing} aria-label="Fechamento">
        <div className="container">
          <p className={styles.closingText}>{contact.closingLine}</p>
        </div>
      </section>
    </>
  );
}
