/**
 * Atribuição de origem do lead (UTMs, gclid, fbclid, página de entrada, referrer).
 * Guarda o PRIMEIRO toque (90 dias) e o ÚLTIMO toque com parâmetros de campanha.
 * Só roda no navegador; falha em silêncio se o storage estiver bloqueado.
 */
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const;
const FIRST = 'fuse_first_touch';
const LAST = 'fuse_last_touch';
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

type Touch = Partial<Record<(typeof KEYS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
  ts?: number;
};

const read = (key: string): Touch | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Touch) : null;
  } catch {
    return null;
  }
};
const write = (key: string, value: Touch) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage bloqueado */ }
};

/** Chamar a cada navegação */
export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const touch: Touch = {};
  KEYS.forEach((k) => { const v = params.get(k); if (v) touch[k] = v.slice(0, 200); });
  const hasCampaign = Object.keys(touch).length > 0;

  const externalReferrer =
    document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : undefined;

  const full: Touch = { ...touch, landing_page: window.location.pathname + window.location.search, referrer: externalReferrer, ts: Date.now() };

  const first = read(FIRST);
  if (!first || (first.ts && Date.now() - first.ts > TTL_MS)) {
    // Primeiro toque: registra mesmo sem UTM (visita orgânica/direta)
    if (hasCampaign || externalReferrer || !first) write(FIRST, full);
  }
  if (hasCampaign) write(LAST, full);
}

/** Dados planos para anexar ao lead */
export function getAttribution(): Record<string, string> {
  const out: Record<string, string> = {};
  const flatten = (prefix: string, t: Touch | null) => {
    if (!t) return;
    Object.entries(t).forEach(([k, v]) => {
      if (v === undefined || k === 'ts') return;
      out[`${prefix}_${k}`] = String(v);
    });
    if (t.ts) out[`${prefix}_date`] = new Date(t.ts).toISOString();
  };
  flatten('first', read(FIRST));
  flatten('last', read(LAST));
  return out;
}
