/**
 * POST /api/lead — recebe o formulário de contato.
 *
 * Fluxo: validação → antispam (honeypot, tempo mínimo, Turnstile opcional)
 *        → Google Apps Script (planilha + e-mail de aviso).
 *
 * Variáveis: LEADS_WEBHOOK_URL, LEADS_WEBHOOK_SECRET,
 *            TURNSTILE_SECRET_KEY (opcional, recomendado).
 */
import { LEAD_FIELDS, validateLead, type LeadField } from '@/lib/lead';

export const runtime = 'nodejs';

const MIN_FILL_MS = 3000; // bots enviam em milissegundos

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

async function verifyTurnstile(token: string | undefined, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile desativado
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
    signal: AbortSignal.timeout(5000),
  });
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }

  // ---------- Antispam ----------
  // Honeypot: campo invisível para pessoas. Se veio preenchido, finge sucesso.
  if (typeof body.company_confirm === 'string' && body.company_confirm.trim() !== '') return json({ ok: true });
  const startedAt = Number(body.startedAt);
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) return json({ ok: true });

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const human = await verifyTurnstile(body.turnstileToken as string | undefined, ip).catch(() => false);
  if (!human) return json({ ok: false, error: 'captcha' }, 400);

  // ---------- Validação ----------
  const consent = body.consent === true;
  const errors = validateLead(body, consent);
  if (Object.keys(errors).length) return json({ ok: false, error: 'validation', fields: errors }, 422);

  const lead = Object.fromEntries(
    (Object.keys(LEAD_FIELDS) as LeadField[]).map((key) => [key, String(body[key] ?? '').trim()]),
  );
  const attribution =
    body.attribution && typeof body.attribution === 'object'
      ? Object.fromEntries(
          Object.entries(body.attribution as Record<string, unknown>)
            .filter(([k]) => /^(first|last)_[a-z_]+$/.test(k))
            .map(([k, v]) => [k, String(v).slice(0, 300)]),
        )
      : {};

  const payload = {
    secret: process.env.LEADS_WEBHOOK_SECRET,
    receivedAt: new Date().toISOString(),
    ...lead,
    consent: 'sim',
    consentText: String(body.consentText ?? '').slice(0, 300),
    page: String(body.page ?? '').slice(0, 300),
    userAgent: request.headers.get('user-agent')?.slice(0, 300) ?? '',
    ...attribution,
  };

  // ---------- Envio para a planilha ----------
  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[lead] LEADS_WEBHOOK_URL não configurada — lead recebido (dev):', { ...payload, secret: '***' });
      return json({ ok: true, dev: true });
    }
    console.error('[lead] LEADS_WEBHOOK_URL ausente em produção');
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow', // o Apps Script responde com redirect
      signal: AbortSignal.timeout(10000),
    });
    const result = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok || !result.ok) throw new Error(result.error ?? `HTTP ${res.status}`);
    return json({ ok: true });
  } catch (err) {
    console.error('[lead] falha ao enviar para a planilha:', err);
    return json({ ok: false, error: 'delivery' }, 502);
  }
}
