// Bitmap del wordmark PIXIES del hero (2026-09-22). Letras dibujadas a mano en píxeles —
// trazo de 2 celdas, 11 filas de alto, 2 celdas de aire entre letras — en vez de
// rasterizar Clash Display: a celdas gruesas la fuente perdía esquinas en la P y la I y
// la S parecía un 8 (Samuel). Aquí cada letra está decidida celda por celda; `#` = píxel.
// Lo consume PixelCanvas (canvas) y sirve como única fuente de verdad de la forma.

const P = ['######.', '#######', '##...##', '##...##', '##...##', '#######', '######.', '##.....', '##.....', '##.....', '##.....'];
const I = ['##', '##', '##', '##', '##', '##', '##', '##', '##', '##', '##'];
const X = ['##....##', '##....##', '.##..##.', '.##..##.', '..####..', '...##...', '..####..', '.##..##.', '.##..##.', '##....##', '##....##'];
const E = ['######', '######', '##....', '##....', '#####.', '#####.', '##....', '##....', '##....', '######', '######'];
// S: arco arriba, trazo izquierdo (2 filas), barra central en diagonal (2 filas), trazo
// derecho y arco abajo. Se distingue de un 8 porque las filas 3–4 están abiertas a la
// derecha y la 7 a la izquierda (un 8 tendría ambos lados cerrados en todas).
const S = ['.#####.', '#######', '##...##', '##.....', '##.....', '.#####.', '..#####', '.....##', '##...##', '#######', '.#####.'];

const AIRE = 2;

function componer(letras: string[][], aire: number): string[] {
  const filas = letras[0]!.length;
  return Array.from({ length: filas }, (_, r) => letras.map((l) => l[r]!).join('.'.repeat(aire)));
}

export const WORDMARK_BITMAP: readonly string[] = componer([P, I, X, I, E, S], AIRE);
export const WORDMARK_ROWS = WORDMARK_BITMAP.length;
export const WORDMARK_COLS = WORDMARK_BITMAP[0]!.length;
export const WORDMARK_PIXELES = WORDMARK_BITMAP.reduce((n, fila) => n + fila.split('#').length - 1, 0);
