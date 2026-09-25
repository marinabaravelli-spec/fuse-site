import Image from 'next/image';
import { EditorialSection } from '@/components/ui/EditorialSection';
import { clients } from '@/content/clients';
import styles from './Clients.module.css';

/**
 * Equilíbrio óptico: logos largos (ex.: Token Nation) ganham mais largura,
 * mas não na proporção total — senão ficariam gigantes e os compactos, minúsculos.
 * Expoente 0 = todos com a mesma largura; 1 = todos com a mesma altura.
 */
const OPTICAL_EXPONENT = 0.6;

export function Clients() {
  return (
    <EditorialSection label="Clientes" titleId="clientes-title" tone="paper">
      <h2 id="clientes-title" className="title-2" data-reveal>Clientes que confiam no nosso método</h2>

      <ul className={styles.row}>
        {clients.map((client) => {
          const ratio = client.width / client.height;
          return (
            <li key={client.id} className={styles.item} style={{ flexGrow: Math.pow(ratio, OPTICAL_EXPONENT) }}>
              <Image
                src={client.src}
                alt={client.name}
                width={client.width}
                height={client.height}
                sizes="(min-width: 960px) 220px, 25vw"
                className={styles.logo}
              />
            </li>
          );
        })}
      </ul>
    </EditorialSection>
  );
}
