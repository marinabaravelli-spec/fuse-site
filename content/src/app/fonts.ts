import localFont from 'next/font/local';

/**
 * Manrope (fonte oficial), variável 200–800, self-hosted via pacote npm.
 * Sem request ao Google em runtime nem em build.
 */
export const manrope = localFont({
  src: '../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2',
  variable: '--font-manrope',
  weight: '200 800',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});
