import { EditorialSection } from '@/components/ui/EditorialSection';
import type { HomeContent } from '@/lib/content';
import styles from './Problem.module.css';

export function Problem({ content }: { content: HomeContent['problem'] }) {
  return (
    <EditorialSection label={content.label} titleId="problema-title" tone="paper">
      <h2 id="problema-title" className="title-2" data-reveal>{content.title}</h2>
      <div className={styles.cols}>
        {content.paragraphs.map((p) => <p key={p}>{p}</p>)}
      </div>
      <p className={styles.closing}>
        {content.closingBefore}{' '}
        {/* A cor só aparece no ponto de conexão */}
        <span className={styles.mark}>{content.closingHighlight}</span>{' '}
        {content.closingAfter}
      </p>
    </EditorialSection>
  );
}
