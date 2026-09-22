import { LinkFuse } from '@/components/ui/LinkFuse';
import type { HomeContent } from '@/lib/content';
import styles from './Hero.module.css';

/** O hero é a tese: o slogan em escala máxima, "Entregamos resultado." no gradiente oficial. */
export function Hero({ content }: { content: HomeContent['hero'] }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className="container">
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.line}>{content.titleLead}</span>
          <span className={styles.line}>
            <span className={styles.fused}>{content.titleFused}</span>
          </span>
        </h1>
        <div className={styles.body}>
          <p className="lead">{content.text}</p>
          <LinkFuse href="/solucoes" className={styles.link}>Conhecer nossas soluções</LinkFuse>
        </div>
        <p className={styles.footnote}>{content.footnote}</p>
      </div>
    </section>
  );
}
