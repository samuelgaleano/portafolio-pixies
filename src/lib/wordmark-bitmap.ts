// Bitmap del wordmark PIXIES del hero. Letras dibujadas a mano en píxeles en vez de
// rasterizar Clash Display: a celdas gruesas la fuente perdía esquinas en la P y la I y
// la S parecía un 8 (Samuel, 2026-09-22). Aquí cada letra está decidida celda por celda.
//
// Resolución (Samuel, 2026-09-22 · segunda ronda): "hacerlo un poquito con un píxel más
// para que se vea mucho más lindo; estructuralmente está bien, solo se ve sencillo porque
// está reducido". Se pasó de 11 filas con trazo de 2 a **15 filas con trazo de 3**: el
// mismo dibujo con celdas más pequeñas y numerosas, así las diagonales de la X y la S se
// resuelven con escalones más finos y el conjunto se lee más trabajado. La proporción del
// conjunto se mantiene (~3,9:1). `#` = píxel encendido.

// prettier-ignore
const P = [
  '#######..',
  '########.',
  '#########',
  '###...###',
  '###...###',
  '###...###',
  '#########',
  '########.',
  '#######..',
  '###......',
  '###......',
  '###......',
  '###......',
  '###......',
  '###......',
];
// prettier-ignore
const I = ['###', '###', '###', '###', '###', '###', '###', '###', '###', '###', '###', '###', '###', '###', '###'];
// prettier-ignore
const X = [
  '###.....###',
  '###.....###',
  '.###...###.',
  '.###...###.',
  '..###.###..',
  '..###.###..',
  '...#####...',
  '....###....',
  '...#####...',
  '..###.###..',
  '..###.###..',
  '.###...###.',
  '.###...###.',
  '###.....###',
  '###.....###',
];
// prettier-ignore
const E = [
  '########',
  '########',
  '########',
  '###.....',
  '###.....',
  '###.....',
  '#######.',
  '#######.',
  '#######.',
  '###.....',
  '###.....',
  '###.....',
  '########',
  '########',
  '########',
];
// S: arco arriba, hombro, trazo izquierdo (3 filas), diagonal central (3), trazo derecho
// (3), hombro y arco abajo. Se distingue de un 8 porque las filas 3–5 están abiertas a la
// derecha y las 9–11 a la izquierda (un 8 tendría ambos lados cerrados en todas).
// prettier-ignore
const S = [
  '.#######.',
  '#########',
  '###...###',
  '###......',
  '###......',
  '###......',
  '.######..',
  '.#######.',
  '..#######',
  '......###',
  '......###',
  '......###',
  '###...###',
  '#########',
  '.#######.',
];

const AIRE = 3;

function componer(letras: string[][], aire: number): string[] {
  const filas = letras[0]!.length;
  return Array.from({ length: filas }, (_, r) => letras.map((l) => l[r]!).join('.'.repeat(aire)));
}

export const WORDMARK_BITMAP: readonly string[] = componer([P, I, X, I, E, S], AIRE);
export const WORDMARK_ROWS = WORDMARK_BITMAP.length;
export const WORDMARK_COLS = WORDMARK_BITMAP[0]!.length;
export const WORDMARK_PIXELES = WORDMARK_BITMAP.reduce((n, fila) => n + fila.split('#').length - 1, 0);
