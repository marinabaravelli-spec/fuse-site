import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { mainNav } from '@/content/navigation';
import { primaryCta } from '@/content/site';
import type { Settings, Solution } from '@/lib/content';
import styles from './Footer.module.css';

export function Footer({ settings, solutions }: { settings: Settings; solutions: Solution[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <Logo height={40} gradientId="logo-footer" />
            <p className={styles.tagline}>{settings.slogan}</p>
          </div>

          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav" className={styles.heading}>Navegação</h2>
            <ul className={styles.list}>
              {mainNav.map((item) => (
                <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-solutions">
            <h2 id="footer-solutions" className={styles.heading}>Soluções</h2>
            <ul className={styles.list}>
              {solutions.map((s) => (
                <li key={s.slug}><Link href={s.href}>{s.name}</Link></li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={styles.heading}>Contato</h2>
            <ul className={styles.list}>
              <li><Link href={primaryCta.href}>{primaryCta.label}</Link></li>
              {settings.email && (
                <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
              )}
              {settings.whatsapp && (
                <li><a href={`https://wa.me/${settings.whatsapp}`} rel="noopener">WhatsApp</a></li>
              )}
              <li>{settings.areaServed}</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} Fuse. Todos os direitos reservados.</p>
          <Link href="/politica-de-privacidade">Política de Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
