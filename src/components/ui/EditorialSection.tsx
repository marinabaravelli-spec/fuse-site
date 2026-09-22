import styles from './EditorialSection.module.css';

type Props = {
  /** Rótulo da coluna estreita (ex.: "Método") */
  label: string;
  /** id do título, usado em aria-labelledby */
  titleId: string;
  tone?: 'dark' | 'raised' | 'paper';
  /** Remove o respiro superior (seções que continuam a anterior) */
  flushTop?: boolean;
  id?: string;
  /** Conteúdo da coluna larga (título, texto, listas) */
  children: React.ReactNode;
  /** Conteúdo que ocupa a largura total, abaixo da grade (ex.: lista de soluções) */
  after?: React.ReactNode;
};

/**
 * Grade editorial padrão do site: rótulo à esquerda (3/12) + conteúdo (9/12).
 */
export function EditorialSection({ label, titleId, tone = 'dark', flushTop, id, children, after }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={[styles.section, styles[tone], flushTop && styles.flushTop].filter(Boolean).join(' ')}
    >
      <div className="container">
        <div className={styles.layout}>
          <p className={styles.label}>{label}</p>
          <div>{children}</div>
        </div>
        {after}
      </div>
    </section>
  );
}
