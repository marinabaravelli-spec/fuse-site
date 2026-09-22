import { EditorialSection } from '@/components/ui/EditorialSection';
import { LinkFuse } from '@/components/ui/LinkFuse';
import type { HomeContent } from '@/lib/content';
import { FusionSteps } from './FusionSteps';
import styles from './Method.module.css';

/** Seção do método — abriga o elemento signature (linha de fusão). */
export function Method({ content, showCta = true }: { content: HomeContent['method']; showCta?: boolean }) {
  return (
    <EditorialSection
      id="metodo"
      label={content.label}
      titleId="metodo-title"
      tone="raised"
      after={
        <>
          <FusionSteps steps={content.steps} />
          {showCta && (
            <div className={styles.cta}>
              <LinkFuse href="/sobre#metodo">{content.ctaLabel}</LinkFuse>
            </div>
          )}
        </>
      }
    >
      <h2 id="metodo-title" className="title-2" data-reveal>{content.title}</h2>
      {content.paragraphs.map((p) => (
        <p key={p} className={`lead ${styles.paragraph}`}>{p}</p>
      ))}
    </EditorialSection>
  );
}
