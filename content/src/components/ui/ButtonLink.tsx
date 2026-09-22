import Link from 'next/link';
import styles from './ButtonLink.module.css';

type Props = {
  href: string;
  children: React.ReactNode;
  size?: 'default' | 'compact';
  className?: string;
};

/** CTA principal. Verde oficial com texto preto (contraste AA). */
export function ButtonLink({ href, children, size = 'default', className }: Props) {
  return (
    <Link href={href} className={[styles.button, styles[size], className].filter(Boolean).join(' ')}>
      {children}
    </Link>
  );
}
