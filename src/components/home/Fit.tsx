import { EditorialSection } from '@/components/ui/EditorialSection';
import type { HomeContent } from '@/lib/content';
import styles from './Fit.module.css';

export function Fit({ content }: { content: HomeContent['fit'] }) {
  return (
    <EditorialSection label={content.label} titleId="para-quem-title" flushTop>
      <h2 id="para-quem-title" className="title-2" data-reveal>{content.title}</h2>
      <p className={`lead ${styles.intro}`}>{content.intro}</p>
      <ul className={styles.list}>
        {content.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </EditorialSection>
  );
}
