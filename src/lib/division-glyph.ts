// Bitmaps del glifo de división: mismas 35 celdas (5×7) del wordmark PIXIES del hero,
// aplicadas a la inicial de cada división. Verificado con Samuel en el mockup
// 15-final-ajustado.html (BRIEF-RONDA2.md §1): M → "me gusta" propio (corazón en bloques,
// nunca redondo/emoji), W → cursor. Letra en reposo, ícono al elegir esa división.
export type DivisionLetra = 'M' | 'W';

export const LETRAS: Record<DivisionLetra, string[]> = {
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
};

export const ICONOS: Record<DivisionLetra, string[]> = {
  M: ['01010', '11111', '11111', '11111', '01110', '00100', '00000'], // corazón en bloques
  W: ['10000', '11000', '10100', '10010', '10001', '10110', '00100'], // cursor
};

// Índices (0–34) de las celdas encendidas de un bitmap 5×7, en orden de lectura —
// es lo que consume DivisionGlyph para pintar <i class="on" style="--gi:N">.
export function celdasEncendidas(bitmap: string[]): number[] {
  const on: number[] = [];
  let i = 0;
  for (const fila of bitmap) {
    for (const bit of fila) {
      if (bit === '1') on.push(i);
      i += 1;
    }
  }
  return on;
}
