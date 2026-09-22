import { SolutionList } from '@/components/solutions/SolutionList';
import { EditorialSection } from '@/components/ui/EditorialSection';
import type { HomeContent, Solution } from '@/lib/content';
import styles from './Solutions.module.css';

type Props = { content: HomeContent['whatWeDo']; solutions: Solution[] };

export function Solutions({ content, solutions }: Props) {
  return (
    <EditorialSection
      label={content.label}
      titleId="solucoes-title"
      after={
        <SolutionList
          items={solutions.map((s) => ({ key: s.slug, name: s.name, href: s.href, summary: s.summary, linkLabel: s.linkLabel }))}
        />
      }
    >
      <h2 id="solucoes-title" className="title-2" data-reveal>{content.title}</h2>
      <p className={`lead ${styles.intro}`}>{content.intro}</p>
    </EditorialSection>
  );
}
