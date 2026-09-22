import { describe, expect, test } from 'vitest';
import { WORDMARK_BITMAP, WORDMARK_COLS, WORDMARK_ROWS, WORDMARK_PIXELES } from './wordmark-bitmap';

describe('wordmark-bitmap — PIXIES en píxeles, dibujado a mano', () => {
  test('es una retícula rectangular: 11 filas del mismo ancho, solo # y .', () => {
    expect(WORDMARK_ROWS).toBe(11);
    for (const fila of WORDMARK_BITMAP) {
      expect(fila).toHaveLength(WORDMARK_COLS);
      expect(fila).toMatch(/^[#.]+$/);
    }
  });

  test('las seis letras quedan separadas por aire (ninguna columna de aire tiene píxeles)', () => {
    // columnas totalmente vacías = separadores; deben existir al menos 5 bloques de aire
    const vacias = Array.from({ length: WORDMARK_COLS }, (_, c) => WORDMARK_BITMAP.every((f) => f[c] === '.'));
    let bloques = 0;
    for (let c = 1; c < WORDMARK_COLS; c++) if (vacias[c] && !vacias[c - 1]) bloques += 1;
    expect(bloques).toBeGreaterThanOrEqual(5);
    // y ninguna columna vacía en los bordes (el bitmap está recortado a la tinta)
    expect(vacias[0]).toBe(false);
    expect(vacias[WORDMARK_COLS - 1]).toBe(false);
  });

  test('pesa poco: entre 180 y 260 píxeles (antes 370–700 partículas muestreadas)', () => {
    expect(WORDMARK_PIXELES).toBeGreaterThanOrEqual(180);
    expect(WORDMARK_PIXELES).toBeLessThanOrEqual(260);
  });

  test('la S no es un 8: filas centrales abiertas en lados opuestos', () => {
    // la S es la última letra: sus 7 columnas finales
    const s = WORDMARK_BITMAP.map((f) => f.slice(-7));
    expect(s[3]).toBe('##.....'); // abierta a la derecha
    expect(s[7]).toBe('.....##'); // abierta a la izquierda
    expect(s[5]).toBe('.#####.'); // barra central
  });

  test('la P y la I no pierden esquinas: la I es un bloque macizo y la P cierra su panza', () => {
    const p = WORDMARK_BITMAP.map((f) => f.slice(0, 7));
    expect(p[0]).toBe('######.');
    expect(p[1]).toBe('#######');
    expect(p[10]).toBe('##.....');
    const i = WORDMARK_BITMAP.map((f) => f.slice(9, 11));
    for (const fila of i) expect(fila).toBe('##');
  });
});
