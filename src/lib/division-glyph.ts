// Bitmaps del glifo de división: mismas 35 celdas (5×7) del wordmark PIXIES del hero,
// aplicadas a la inicial de cada división. Verificado con Samuel en el mockup
// 15-final-ajustado.html (BRIEF-RONDA2.md §1): M → "me gusta" propio (corazón en bloques,
// nunca redondo/emoji), W → cursor. Letra en reposo, ícono al elegir esa división.
export type DivisionLetra = 'M' | 'W';

export const LETRAS: Record<DivisionLetra, string[]> = {
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
};

// El cursor (W) se rediseñó el 2026-09-21 a pedido de Samuel: la versión anterior era el
// CONTORNO de una flecha (una línea diagonal hueca), que a 5×7 no se leía como puntero.
// Ahora es la silueta clásica RELLENA: cabeza triangular con la punta arriba-izquierda
// (filas 0–4) y la cola bajando hacia la derecha (filas 5–6). Bloques duros, sin curvas.
export const ICONOS: Record<DivisionLetra, string[]> = {
  M: ['01010', '11111', '11111', '11111', '01110', '00100', '00000'], // corazón en bloques
  W: ['10000', '11000', '11100', '11110', '11111', '00110', '00011'], // cursor relleno + cola
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

// Rol de cada una de las 35 celdas al pasar de la letra al ícono: las que quedan, las que
// se apagan, las que se encienden. Es lo que permite el morph PROGRESIVO (celda por celda,
// con desfase) en vez de un cambio de frame: DivisionGlyph pinta las tres clases y el CSS
// anima cada celda por separado.
export type RolCelda = 'keep' | 'out' | 'in' | 'off';
export function rolesDeCeldas(letra: string[], icono: string[]): RolCelda[] {
  const a = new Set(celdasEncendidas(letra));
  const b = new Set(celdasEncendidas(icono));
  return Array.from({ length: 35 }, (_, i) => {
    const enA = a.has(i);
    const enB = b.has(i);
    if (enA && enB) return 'keep';
    if (enA) return 'out';
    if (enB) return 'in';
    return 'off';
  });
}
