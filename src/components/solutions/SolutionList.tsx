import Link from 'next/link';
import styles from './SolutionList.module.css';

export type SolutionListItem = { key: string; name: string; href: string; summary: string; linkLabel: string };

/** Lista editorial de soluções (Home, pilar e "complementares"). Sem numeração: não é sequência. */
export function SolutionList({ items, compact = false }: { items: SolutionListItem[]; compact?: boolean }) {
  return (
    <ul className={[styles.list, compact && styles.compact].filter(Boolean).join(' ')}>
      {items.map((s) => (
        <li key={s.key} className={styles.item}>
          <Link href={s.href} className={styles.link}>
            <h3 className={styles.name}>{s.name}</h3>
            <p className={styles.summary}>{s.summary}</p>
            <span className={styles.cta}>{s.linkLabel}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
