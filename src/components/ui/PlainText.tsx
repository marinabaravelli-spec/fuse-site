import { Fragment } from 'react';

/**
 * Renderiza o texto simples editado no painel (Keystatic) com três marcações:
 *   - linha começando com "- "  → item de lista
 *   - **trecho**                → negrito
 *   - linha em branco           → novo parágrafo
 * Não usa dangerouslySetInnerHTML: o texto nunca vira HTML arbitrário.
 */

type Block = { kind: 'p'; text: string } | { kind: 'ul'; items: string[] };

function parse(source: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ kind: 'p', text: paragraph.join(' ') });
    paragraph = [];
  };

  for (const raw of source.split('\n')) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      continue;
    }
    if (line.startsWith('- ')) {
      flushParagraph();
      const last = blocks[blocks.length - 1];
      const item = line.slice(2).trim();
      if (last?.kind === 'ul') last.items.push(item);
      else blocks.push({ kind: 'ul', items: [item] });
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();
  return blocks;
}

/** **negrito** → <strong>; o resto fica como texto. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

type Props = {
  text: string;
  /** Classes opcionais para estilizar parágrafos e listas */
  paragraphClassName?: string;
  listClassName?: string;
};

export function PlainText({ text, paragraphClassName, listClassName }: Props) {
  return (
    <>
      {parse(text).map((block, i) =>
        block.kind === 'p' ? (
          <p key={i} className={paragraphClassName}>
            <Inline text={block.text} />
          </p>
        ) : (
          <ul key={i} className={listClassName}>
            {block.items.map((item, j) => (
              <li key={j}>
                <Inline text={item} />
              </li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}
