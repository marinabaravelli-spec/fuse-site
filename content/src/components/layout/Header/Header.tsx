'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { mainNav } from '@/content/navigation';
import { primaryCta } from '@/content/site';
import styles from './Header.module.css';

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fundo do header só aparece depois de rolar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha o menu ao navegar
  useEffect(() => setMenuOpen(false), [pathname]);

  // Trava o scroll do body com o menu aberto; Esc fecha; fecha ao virar desktop
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    const desktop = window.matchMedia('(min-width: 960px)');
    const onDesktop = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onDesktop);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [menuOpen]);

  const isCurrent = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <header className={[styles.header, (scrolled || menuOpen) && styles.solid].filter(Boolean).join(' ')}>
        <div className={`container ${styles.inner}`}>
          <Link href="/" className={styles.logo} aria-label="Fuse, página inicial">
            <Logo height={30} gradientId="logo-header" title="Fuse" />
          </Link>

          <nav className={styles.nav} aria-label="Principal">
            <ul className={styles.navList}>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.cta}>
            <ButtonLink href={primaryCta.href} size="compact">{primaryCta.label}</ButtonLink>
          </div>

          <button
            type="button"
            className={styles.toggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.bars} data-open={menuOpen} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={styles.mobileMenu} data-open={menuOpen} hidden={!menuOpen}>
        <nav aria-label="Principal (mobile)">
          <ul>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.mobileLink} aria-current={isCurrent(item.href) ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ButtonLink href={primaryCta.href} className={styles.mobileCta}>{primaryCta.label}</ButtonLink>
      </div>
    </>
  );
}
