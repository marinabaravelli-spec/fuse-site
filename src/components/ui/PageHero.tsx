import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import styles from './PageHero.module.css';

type Props = {
  breadcrumbs: Crumb[];
  title: string;
  /** Primeiro parágrafo em destaque; os demais em tamanho de corpo */
  intro: readonly string[];
};

/** Abertura das páginas internas: breadcrumb, H1 e definição direta (GEO). */
export function PageHero({ breadcrumbs, title, intro }: Props) {
  const [first, ...rest] = intro;
  return (
    <section className={styles.hero} aria-labelledby="page-title">
      <div className="container">
        <Breadcrumbs items={breadcrumbs} />
        <h1 id="page-title" className={styles.title}>{title}</h1>
        <div className={styles.intro}>
          {first && <p className={styles.first}>{first}</p>}
          {rest.map((p) => <p key={p} className={styles.rest}>{p}</p>)}
        </div>
      </div>
    </section>
  );
}
