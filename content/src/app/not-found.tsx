import type { Metadata } from 'next';
import { SiteShell } from '@/components/layout/SiteShell';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { LinkFuse } from '@/components/ui/LinkFuse';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: { absolute: 'Página não encontrada | Fuse' },
  description: 'O endereço pode ter mudado ou não estar mais disponível.',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className={`container ${styles.wrap}`} aria-labelledby="nf-title">
        <h1 id="nf-title" className={styles.title}>Esta página saiu do caminho.</h1>
        <p className="lead">O endereço pode ter mudado ou não estar mais disponível. Volte para a Home ou explore nossas soluções.</p>
        <div className={styles.actions}>
          <ButtonLink href="/">Voltar para a Home</ButtonLink>
          <LinkFuse href="/solucoes">Explorar soluções</LinkFuse>
        </div>
      </section>
    </SiteShell>
  );
}
