'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './FusionSteps.module.css';

type Step = { title: string; text: string };

/**
 * ELEMENTO SIGNATURE — a linha de fusão.
 * Uma linha liga as etapas do método. Conforme a página rola, ela ganha o
 * gradiente oficial e cada etapa "funde" quando a linha chega ao seu nó.
 * Horizontal no desktop, vertical no mobile — detectado pela posição real
 * dos nós, sem duplicar breakpoints no JS.
 *
 * Sem JS ou com prefers-reduced-motion: tudo aparece fundido e estático.
 */
export function FusionSteps({ steps }: { steps: readonly Step[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [fused, setFused] = useState<boolean[]>(() => steps.map(() => true));
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const nodes = nodeRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!root || !track || nodes.length < 2) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let thresholds: number[] = [];
    let frame = 0;

    const center = (el: HTMLElement, box: DOMRect) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    };

    // Posiciona o trilho entre o primeiro e o último nó
    const layout = () => {
      const box = root.getBoundingClientRect();
      const first = center(nodes[0], box);
      const last = center(nodes[nodes.length - 1], box);
      const isVertical = Math.abs(last.y - first.y) > Math.abs(last.x - first.x);
      const length = isVertical ? last.y - first.y : last.x - first.x;

      setVertical(isVertical);
      Object.assign(track.style, isVertical
        ? { left: `${first.x - 1}px`, top: `${first.y}px`, width: '2px', height: `${length}px` }
        : { left: `${first.x}px`, top: `${first.y - 1}px`, width: `${length}px`, height: '2px' });

      thresholds = nodes.map((node) => {
        const c = center(node, box);
        const pos = isVertical ? c.y - first.y : c.x - first.x;
        return Math.max(0.02, length > 0 ? pos / length : 0);
      });
    };

    // Progresso 0→1 conforme a seção atravessa a viewport
    const update = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.78 - rect.top) / (rect.height * 0.85)));
      root.style.setProperty('--fusion-progress', progress.toFixed(4));
      setFused((prev) => {
        const next = thresholds.map((t) => progress >= t - 0.001);
        return next.every((v, i) => v === prev[i]) ? prev : next;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const onResize = () => { layout(); if (!reduced) update(); };

    layout();
    root.dataset.enhanced = 'true';

    if (reduced) {
      root.style.setProperty('--fusion-progress', '1');
      setFused(steps.map(() => true));
    } else {
      update();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [steps]);

  return (
    <div ref={rootRef} className={styles.fusion} data-vertical={vertical}>
      <div ref={trackRef} className={styles.track} aria-hidden="true">
        <span className={styles.fill} />
      </div>
      <ol className={styles.steps}>
        {steps.map((step, i) => (
          <li key={step.title} className={styles.step} data-fused={fused[i]}>
            <span ref={(el) => { nodeRefs.current[i] = el; }} className={styles.node} aria-hidden="true" />
            <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.text}>{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
