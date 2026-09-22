import { ButtonLink } from '@/components/ui/ButtonLink';
import { primaryCta } from '@/content/site';
import styles from './FinalCta.module.css';

type Props = {
  title: string;
  text?: string;
  buttonLabel?: string;
  /** Destino do botão; ex.: /contato?interesse=estrategia pré-seleciona a solução no formulário */
  href?: string;
};

/** Fechamento de página: a linha de fusão chega completa até aqui. */
export function FinalCta({ title, text, buttonLabel = primaryCta.label, href = primaryCta.href }: Props) {
  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <div className="container">
        <h2 id="cta-title" className={styles.title} data-reveal>{title}</h2>
        <div className={styles.body}>
          {text ? <p className="lead">{text}</p> : <span />}
          <ButtonLink href={href} className={styles.button}>{buttonLabel}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
