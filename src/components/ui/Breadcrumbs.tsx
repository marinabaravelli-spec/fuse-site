import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

export type Crumb = { name: string; path: string };

/** Breadcrumb visível. O último item é a página atual (sem link). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Você está em" className={styles.nav}>
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className={styles.item}>
              {isLast ? <span aria-current="page">{item.name}</span> : <Link href={item.path}>{item.name}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
