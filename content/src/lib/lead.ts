/**
 * Contrato do lead — compartilhado entre o formulário e a API.
 * Validação sem dependências: mesmas regras no cliente e no servidor.
 */
export const LEAD_FIELDS = {
  name: { label: 'Nome', required: true, max: 120 },
  company: { label: 'Empresa', required: true, max: 160 },
  role: { label: 'Cargo', required: true, max: 120 },
  email: { label: 'E-mail corporativo', required: true, max: 160 },
  phone: { label: 'Telefone/WhatsApp', required: true, max: 40 },
  city: { label: 'Cidade e estado', required: true, max: 120 },
  website: { label: 'Site da empresa', required: false, max: 200 },
  challenge: { label: 'Principal desafio atual', required: true, max: 3000 },
  interest: { label: 'Solução de maior interesse', required: true, max: 80 },
  source: { label: 'Como conheceu a Fuse?', required: false, max: 120 },
} as const;

export type LeadField = keyof typeof LEAD_FIELDS;
export type LeadData = Record<LeadField, string>;
export type LeadErrors = Partial<Record<LeadField | 'consent', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateLead(data: Partial<Record<string, unknown>>, consent: boolean): LeadErrors {
  const errors: LeadErrors = {};

  (Object.keys(LEAD_FIELDS) as LeadField[]).forEach((key) => {
    const rule = LEAD_FIELDS[key];
    const value = typeof data[key] === 'string' ? (data[key] as string).trim() : '';
    if (rule.required && !value) errors[key] = `Preencha o campo ${rule.label}.`;
    else if (value.length > rule.max) errors[key] = `${rule.label}: use no máximo ${rule.max} caracteres.`;
  });

  const email = String(data.email ?? '').trim();
  if (email && !EMAIL_RE.test(email)) errors.email = 'Informe um e-mail válido, como nome@empresa.com.br.';

  const digits = String(data.phone ?? '').replace(/\D/g, '');
  if (digits && (digits.length < 10 || digits.length > 13)) errors.phone = 'Informe o telefone com DDD, como (11) 98765-4321.';

  const website = String(data.website ?? '').trim();
  if (website && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(website)) errors.website = 'Informe um endereço válido, como empresa.com.br.';

  const challenge = String(data.challenge ?? '').trim();
  if (challenge && challenge.length < 15 && !errors.challenge) errors.challenge = 'Conte um pouco mais: pelo menos uma frase sobre o desafio.';

  if (!consent) errors.consent = 'Para enviar, é preciso concordar com a Política de Privacidade.';

  return errors;
}
