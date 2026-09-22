import { EditorialSection } from '@/components/ui/EditorialSection';
import type { HomeContent } from '@/lib/content';
import styles from './Differential.module.css';

export function Differential({ content }: { content: HomeContent['differential'] }) {
  return (
    <EditorialSection label={content.label} titleId="diferencial-title">
      <h2 id="diferencial-title" className="title-2" data-reveal>{content.title}</h2>
      <p className={`lead ${styles.intro}`}>{content.intro}</p>
      <ul className={styles.principles}>
        {content.principles.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </EditorialSection>
  );
}
