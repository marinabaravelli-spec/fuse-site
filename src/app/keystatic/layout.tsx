import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isKeystaticEnabled } from '@/lib/keystatic-access';
import KeystaticApp from './keystatic';

export const metadata: Metadata = {
  title: { absolute: 'Painel de conteúdo | Fuse' },
  robots: { index: false, follow: false },
};

export default function KeystaticLayout() {
  if (!isKeystaticEnabled) notFound();
  return <KeystaticApp />;
}
