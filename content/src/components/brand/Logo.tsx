import { LOGO_PATH, LOGO_RATIO, LOGO_VIEWBOX } from './logo-path';

type LogoProps = {
  /** Altura em px; a largura segue a proporção do logo */
  height?: number;
  /** id único do gradiente quando houver mais de um logo na página */
  gradientId?: string;
  className?: string;
  title?: string;
};

/** Logo Fuse com o gradiente oficial #9933FF → #4D7FEA → #00E5A0 */
export function Logo({ height = 30, gradientId = 'fuse-logo-gradient', className, title = 'Fuse' }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox={LOGO_VIEWBOX}
      width={Math.round(height * LOGO_RATIO)}
      height={height}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9933FF" />
          <stop offset=".5" stopColor="#4D7FEA" />
          <stop offset="1" stopColor="#00E5A0" />
        </linearGradient>
      </defs>
      <path fill={`url(#${gradientId})`} fillRule="evenodd" d={LOGO_PATH} />
    </svg>
  );
}
