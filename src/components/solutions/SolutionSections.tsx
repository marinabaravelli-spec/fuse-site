import type { SolutionEntry } from '@/lib/content';
import styles from './SolutionSections.module.css';

type Section = SolutionEntry['sections'][number];

/** Renderiza os blocos editáveis no painel (Keystatic → "Seções da página"). */
export function SolutionSections({ sections }: { sections: readonly Section[] }) {
  return (
    <>
      {sections.map((section, i) => {
        const id = `secao-${i + 1}`;
        switch (section.discriminant) {
          case 'offerings':
            return (
              <section key={id} className={styles.section} aria-labelledby={id}>
                <div className={`container ${styles.layout}`}>
                  <h2 id={id} className={styles.heading} data-reveal>{section.value.heading}</h2>
                  <ul className={styles.offerings}>
                    {section.value.items.map((item) => (
                      <li key={item.title}>
                        <h3 className={styles.offerTitle}>{item.title}</h3>
                        <p className={styles.offerText}>{item.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );

          case 'steps':
            return (
              <section key={id} className={styles.section} aria-labelledby={id}>
                <div className={`container ${styles.layout}`}>
                  <h2 id={id} className={styles.heading} data-reveal>{section.value.heading}</h2>
                  <ol className={styles.steps}>
                    {section.value.items.map((step, n) => (
                      <li key={step}>
                        <span className={styles.stepIndex} aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            );

          case 'list':
            return (
              <section key={id} className={styles.section} aria-labelledby={id}>
                <div className={`container ${styles.layout}`}>
                  <h2 id={id} className={styles.heading} data-reveal>{section.value.heading}</h2>
                  <div>
                    {section.value.intro && <p className={styles.listIntro}>{section.value.intro}</p>}
                    <ul className={styles.list}>
                      {section.value.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </section>
            );

          case 'statement':
            return (
              <section key={id} className={`${styles.section} ${styles.statement}`} aria-labelledby={id}>
                <div className="container">
                  <h2 id={id} className={`title-2 ${styles.statementTitle}`} data-reveal>{section.value.heading}</h2>
                  <div className={styles.statementBody}>
                    {section.value.paragraphs.map((p) => <p key={p} className="lead">{p}</p>)}
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
