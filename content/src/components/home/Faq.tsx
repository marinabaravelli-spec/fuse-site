import { EditorialSection } from '@/components/ui/EditorialSection';
import type { FaqItem } from '@/lib/content';
import styles from './Faq.module.css';

type Props = { label: string; title: string; items: readonly FaqItem[]; titleId?: string; flushTop?: boolean };

/**
 * FAQ com <details> nativo: acessível, sem JS e com o texto no HTML.
 * Reutilizável nas páginas de solução. O JSON-LD FAQPage fica na página.
 */
export function Faq({ label, title, items, titleId = 'faq-title', flushTop = true }: Props) {
  return (
    <EditorialSection label={label} titleId={titleId} flushTop={flushTop}>
      <h2 id={titleId} className={`title-2 ${styles.title}`} data-reveal>{title}</h2>
      <div className={styles.list}>
        {items.map((item) => (
          <details key={item.question} className={styles.item}>
            <summary className={styles.question}>
              {item.question}
              <span className={styles.icon} aria-hidden="true" />
            </summary>
            <p className={styles.answer}>{item.answer}</p>
          </details>
        ))}
      </div>
    </EditorialSection>
  );
}
