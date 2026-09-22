import Image from 'next/image';
import { EditorialSection } from '@/components/ui/EditorialSection';
import type { Settings } from '@/lib/content';
import styles from './Leadership.module.css';

type Props = { label: string; title: string; people: Settings['leadership'] };

/**
 * Liderança — lida das Configurações da Fuse no painel.
 * Mostra só o que existe: sem foto, sem bio ou sem LinkedIn, o bloco se adapta.
 */
export function Leadership({ label, title, people }: Props) {
  return (
    <EditorialSection label={label} titleId="lideranca-title">
      <h2 id="lideranca-title" className="title-2" data-reveal>{title}</h2>
      <ul className={styles.people}>
        {people.map((person) => (
          <li key={person.name} className={styles.person}>
            {person.photo && (
              <div className={styles.photo}>
                <Image
                  src={person.photo}
                  alt={`${person.name}, ${person.role} da Fuse`}
                  fill
                  sizes="(min-width: 960px) 280px, 60vw"
                />
              </div>
            )}
            <div>
              <h3 className={styles.name}>{person.name}</h3>
              <p className={styles.role}>{person.role}</p>
              {person.bio && <p className={styles.bio}>{person.bio}</p>}
              {person.linkedin && (
                <a className={styles.linkedin} href={person.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn de {person.name.split(' ')[0]}
                  <span className="visually-hidden"> (abre em nova aba)</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </EditorialSection>
  );
}
