'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { captureAttribution } from '@/lib/attribution';
import { track } from '@/lib/analytics';

/**
 * Comportamentos globais do lado do cliente:
 * - revela elementos com [data-reveal] ao entrar na tela;
 * - registra a origem do visitante (UTMs) para anexar ao lead;
 * - mede cliques em WhatsApp e no CTA principal.
 */
export function ClientEnhancements() {
  const pathname = usePathname();

  useEffect(() => { captureAttribution(); }, [pathname]);

  // Delegação: um único listener mede todos os cliques relevantes
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;
      if (link.href.includes('wa.me/')) track('whatsapp_click', { location: window.location.pathname });
      else if (link.pathname === '/contato') track('cta_click', { label: link.textContent?.trim(), location: window.location.pathname });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
