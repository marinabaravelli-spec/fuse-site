/**
 * Eventos de conversão (briefing §10), enviados ao dataLayer.
 * Funciona com GTM/GA4 quando instalados; sem eles, não faz nada.
 */
type EventName = 'cta_click' | 'whatsapp_click' | 'form_start' | 'generate_lead' | 'form_error';

declare global {
  interface Window { dataLayer?: Record<string, unknown>[] }
}

export function track(event: EventName, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
