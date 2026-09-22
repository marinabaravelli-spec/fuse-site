/**
 * Em produção, o painel só existe com armazenamento github/cloud.
 * Com "local", ele gravaria no disco do servidor — bloqueado por segurança.
 */
export const isKeystaticEnabled =
  process.env.NODE_ENV !== 'production' || (process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE ?? 'local') !== 'local';
