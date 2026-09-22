import Link from 'next/link';
import styles from './LinkFuse.module.css';

/** Link secundário: o sublinhado "funde" com o gradiente oficial no hover/foco. */
export function LinkFuse({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={[styles.link, className].filter(Boolean).join(' ')}>
      {children}
    </Link>
  );
}
