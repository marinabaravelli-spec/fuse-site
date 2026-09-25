/**
 * Clientes exibidos na Home e listados no /llms.txt.
 * Fica no código (não no painel) por decisão do projeto.
 *
 * Para trocar ou adicionar um logo:
 *  1. PNG com fundo transparente, recortado rente ao desenho, em /public/images/clients/
 *     (ideal: 600 px ou mais de largura);
 *  2. informe width/height reais do arquivo — o tamanho visual é calculado a partir da proporção.
 */
export type Client = {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
};

export const clients: Client[] = [
  // Ordem de exibição definida pela Fuse. Versões em preto, para a faixa clara da Home.
  { id: 'saint-gobain', name: 'Saint-Gobain', src: '/images/clients/saint-gobain.png', width: 800, height: 334 },
  { id: 'token-nation', name: 'Token Nation', src: '/images/clients/token-nation.png', width: 800, height: 85 },
  { id: 'vereda', name: 'Escola Vereda', src: '/images/clients/vereda.png', width: 800, height: 204 },
  { id: 'abc-founders', name: 'ABC Founders', src: '/images/clients/abc-founders.png', width: 800, height: 452 },
  { id: 'clube-executivos', name: 'Clube dos Executivos', src: '/images/clients/clube-executivos.png', width: 800, height: 278 },
];
