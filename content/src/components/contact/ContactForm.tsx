'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { getAttribution } from '@/lib/attribution';
import { LEAD_FIELDS, validateLead, type LeadErrors, type LeadField } from '@/lib/lead';
import styles from './ContactForm.module.css';

type Props = {
  interests: { value: string; slug?: string }[];
  howFoundOptions: readonly string[];
  challengePlaceholder: string;
  consentText: string;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  errorMessage: string;
  whatsappHref: string;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm(props: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const interestRef = useRef<HTMLSelectElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef<number>(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<LeadErrors>({});

  useEffect(() => {
    startedAt.current = Date.now();
    // Pré-seleciona a solução quando o visitante vem de /solucoes/<slug>
    const slug = new URLSearchParams(window.location.search).get('interesse');
    const match = props.interests.find((i) => i.slug && i.slug === slug);
    if (match && interestRef.current) interestRef.current.value = match.value;
  }, [props.interests]);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const onFirstInteraction = () => {
    if (formRef.current?.dataset.started) return;
    formRef.current!.dataset.started = 'true';
    track('form_start', { form: 'contato' });
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries((Object.keys(LEAD_FIELDS) as LeadField[]).map((k) => [k, String(fd.get(k) ?? '')]));
    const consent = fd.get('consent') === 'on';

    const found = validateLead(data, consent);
    setErrors(found);
    if (Object.keys(found).length) {
      track('form_error', { form: 'contato', reason: 'validation' });
      // Leva o foco ao primeiro campo com erro
      const first = Object.keys(found)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          consent,
          consentText: props.consentText,
          company_confirm: String(fd.get('company_confirm') ?? ''),
          startedAt: startedAt.current,
          turnstileToken: fd.get('cf-turnstile-response') ?? undefined,
          page: window.location.pathname + window.location.search,
          attribution: getAttribution(),
        }),
      });
      const result = (await res.json().catch(() => ({}))) as { ok?: boolean; fields?: LeadErrors };
      if (!res.ok || !result.ok) {
        if (result.fields) setErrors(result.fields);
        throw new Error('envio');
      }
      track('generate_lead', { form: 'contato', interest: data.interest });
      setStatus('success');
    } catch {
      track('form_error', { form: 'contato', reason: 'delivery' });
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status">
        <h2 ref={successRef} tabIndex={-1} className={styles.successTitle}>{props.successTitle}</h2>
        <p className={styles.successText}>{props.successMessage}</p>
      </div>
    );
  }

  const field = (key: LeadField) => ({
    id: `f-${key}`,
    name: key,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `f-${key}-error` : undefined,
    maxLength: LEAD_FIELDS[key].max,
  });
  const error = (key: LeadField | 'consent') =>
    errors[key] ? <p id={`f-${key}-error`} className={styles.error}>{errors[key]}</p> : null;
  const label = (key: LeadField) => (
    <label htmlFor={`f-${key}`} className={styles.label}>
      {LEAD_FIELDS[key].label}
      {!LEAD_FIELDS[key].required && <span className={styles.optional}> (opcional)</span>}
    </label>
  );

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} onFocus={onFirstInteraction} noValidate>
      <div className={styles.grid}>
        <div className={styles.field}>{label('name')}<input {...field('name')} autoComplete="name" required />{error('name')}</div>
        <div className={styles.field}>{label('company')}<input {...field('company')} autoComplete="organization" required />{error('company')}</div>
        <div className={styles.field}>{label('role')}<input {...field('role')} autoComplete="organization-title" required />{error('role')}</div>
        <div className={styles.field}>{label('email')}<input {...field('email')} type="email" autoComplete="email" inputMode="email" required />{error('email')}</div>
        <div className={styles.field}>{label('phone')}<input {...field('phone')} type="tel" autoComplete="tel" inputMode="tel" required />{error('phone')}</div>
        <div className={styles.field}>{label('city')}<input {...field('city')} autoComplete="address-level2" placeholder="Ex.: Santo André, SP" required />{error('city')}</div>
        <div className={`${styles.field} ${styles.full}`}>{label('website')}<input {...field('website')} type="url" inputMode="url" autoComplete="url" placeholder="empresa.com.br" />{error('website')}</div>

        <div className={`${styles.field} ${styles.full}`}>
          {label('challenge')}
          <textarea {...field('challenge')} rows={5} placeholder={props.challengePlaceholder} required />
          {error('challenge')}
        </div>

        <div className={styles.field}>
          {label('interest')}
          <select {...field('interest')} ref={interestRef} defaultValue="" required>
            <option value="" disabled>Selecione</option>
            {props.interests.map((i) => <option key={i.value} value={i.value}>{i.value}</option>)}
          </select>
          {error('interest')}
        </div>
        <div className={styles.field}>
          {label('source')}
          <select {...field('source')} defaultValue="">
            <option value="">Selecione</option>
            {props.howFoundOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          {error('source')}
        </div>
      </div>

      {/* Honeypot: invisível para pessoas, preenchido por robôs */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="f-company_confirm">Não preencha este campo</label>
        <input id="f-company_confirm" name="company_confirm" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.consent}>
        <input
          id="f-consent"
          name="consent"
          type="checkbox"
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? 'f-consent-error' : undefined}
        />
        <label htmlFor="f-consent">
          {props.consentText}{' '}
          <Link href="/politica-de-privacidade" target="_blank">Ler a Política de Privacidade<span className="visually-hidden"> (abre em nova aba)</span></Link>
        </label>
      </div>
      {error('consent')}

      {TURNSTILE_SITE_KEY && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className={`cf-turnstile ${styles.turnstile}`} data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark" data-language="pt-br" />
        </>
      )}

      {status === 'error' && (
        <div className={styles.alert} role="alert">
          <p>{props.errorMessage}</p>
          <a href={props.whatsappHref} target="_blank" rel="noopener noreferrer">Abrir o WhatsApp da Fuse</a>
        </div>
      )}

      <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Enviando…' : props.submitLabel}
      </button>
    </form>
  );
}
