// Bitmaps del glifo de división: retícula 7×9 (63 celdas) aplicada a la inicial de cada
// división. Letra en reposo, ícono al elegir esa división.
//
// 2026-09-22 (Samuel): la inicial de Creative es la **C** (ya no la M de "Marketing"), y
// el cursor tenía que "parecerse más a un cursor, con más píxeles si hace falta". Por eso
// la retícula pasó de 5×7 a 7×9: a 5×7 el puntero era un triángulo y la C se confundía
// con una O. El corazón sigue en bloques duros (nunca redondo/emoji), verificado con
// Samuel en el mockup 15-final-ajustado.html (BRIEF-RONDA2.md §1).
export type DivisionLetra = 'C' | 'W';

export const GLYPH_COLS = 7;
export const GLYPH_ROWS = 9;
export const GLYPH_CELDAS = GLYPH_COLS * GLYPH_ROWS;

export const LETRAS: Record<DivisionLetra, string[]> = {
  C: ['0011110', '0100001', '1000000', '1000000', '1000000', '1000000', '1000000', '0100001', '0011110'],
  W: ['1000001', '1000001', '1000001', '1000001', '1001001', '1001001', '1010101', '1010101', '0100010'],
};

// Cursor (W): silueta clásica de puntero — cabeza triangular con la punta arriba-izquierda
// (filas 0–6, crece una celda por fila), base recortada y la COLA que baja hacia la
// derecha separándose del borde izquierdo (filas 7–8). Bloques duros, sin curvas.
// Corazón (C): dos lóbulos arriba, cuerpo lleno y punta abajo, centrado en la retícula.
export const ICONOS: Record<DivisionLetra, string[]> = {
  C: ['0000000', '0110110', '1111111', '1111111', '1111111', '0111110', '0011100', '0001000', '0000000'],
  W: ['1000000', '1100000', '1110000', '1111000', '1111100', '1111110', '1111111', '1101100', '1000110'],
};

// Índices (0–62) de las celdas encendidas de un bitmap 7×9, en orden de lectura —
// es lo que consume DivisionGlyph para pintar <i class="c-…" style="--gi:N">.
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

// Rol de cada una de las 63 celdas al pasar de la letra al ícono: las que quedan, las que
// se apagan, las que se encienden. Es lo que permite el morph PROGRESIVO (celda por celda,
// con desfase) en vez de un cambio de frame: DivisionGlyph pinta las tres clases y el CSS
// anima cada celda por separado.
export type RolCelda = 'keep' | 'out' | 'in' | 'off';
export function rolesDeCeldas(letra: string[], icono: string[]): RolCelda[] {
  const a = new Set(celdasEncendidas(letra));
  const b = new Set(celdasEncendidas(icono));
  return Array.from({ length: GLYPH_CELDAS }, (_, i) => {
    const enA = a.has(i);
    const enB = b.has(i);
    if (enA && enB) return 'keep';
    if (enA) return 'out';
    if (enB) return 'in';
    return 'off';
  });
}
