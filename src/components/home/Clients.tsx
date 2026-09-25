'use client';

import Image from 'next/image';
import styles from './Clients.module.css';

const clients = [
  { id: 'saint-gobain', name: 'Saint-Gobain', src: '/images/clients/saint-gobain.png' },
  { id: 'token-nation', name: 'Token Nation', src: '/images/clients/token-nation.png' },
  { id: 'vereda', name: 'Vereda', src: '/images/clients/vereda.png' },
  { id: 'abc-founders', name: 'ABC Founders', src: '/images/clients/abc-founders.png' },
  { id: 'clube-executivos', name: 'Clube dos Executivos', src: '/images/clients/clube-executivos.png' },
];

export function Clients() {
  return (
    <section className={styles.section} data-reveal>
      <div className={styles.container}>
        <h2 className="title-2">Clientes que confiam no nosso método</h2>

        <div className={styles.grid}>
          {clients.map((client) => (
            <div key={client.id} className={styles.logoWrapper}>
              <Image
                src={client.src}
                alt={`Logo ${client.name}`}
                width={180}
                height={120}
                quality={90}
                priority={false}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
