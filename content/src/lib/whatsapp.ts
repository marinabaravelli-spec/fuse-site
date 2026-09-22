/** Link de WhatsApp com mensagem inicial (funciona no celular e no desktop). */
export const whatsappUrl = (number: string, message?: string) =>
  `https://wa.me/${number.replace(/\D/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

/** 5511982159171 → (11) 98215-9171 */
export function formatBrazilianPhone(number: string) {
  const d = number.replace(/\D/g, '').replace(/^55/, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return number;
}
