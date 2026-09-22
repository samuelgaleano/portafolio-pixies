import { describe, expect, test } from 'vitest';
import { WORDMARK_BITMAP, WORDMARK_COLS, WORDMARK_ROWS, WORDMARK_PIXELES } from './wordmark-bitmap';

describe('wordmark-bitmap — PIXIES en píxeles, dibujado a mano', () => {
  test('es una retícula rectangular: 15 filas del mismo ancho, solo # y .', () => {
    expect(WORDMARK_ROWS).toBe(15);
    for (const fila of WORDMARK_BITMAP) {
      expect(fila).toHaveLength(WORDMARK_COLS);
      expect(fila).toMatch(/^[#.]+$/);
    }
  });

  test('mantiene la proporción del wordmark tipográfico (~3,9:1)', () => {
    const ratio = WORDMARK_COLS / WORDMARK_ROWS;
    expect(ratio).toBeGreaterThan(3.5);
    expect(ratio).toBeLessThan(4.2);
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

  test('resolución "un píxel más" (Samuel): entre 380 y 480 celdas — antes 224', () => {
    expect(WORDMARK_PIXELES).toBeGreaterThanOrEqual(380);
    expect(WORDMARK_PIXELES).toBeLessThanOrEqual(480);
  });

  test('la S no es un 8: filas centrales abiertas en lados opuestos', () => {
    // la S es la última letra: sus 9 columnas finales
    const s = WORDMARK_BITMAP.map((f) => f.slice(-9));
    expect(s[3]).toBe('###......'); // abierta a la derecha
    expect(s[4]).toBe('###......');
    expect(s[9]).toBe('......###'); // abierta a la izquierda
    expect(s[10]).toBe('......###');
    expect(s[7]).toBe('.#######.'); // barra central
  });

  test('la P y la I no pierden esquinas: la I es un bloque macizo y la P cierra su panza', () => {
    const p = WORDMARK_BITMAP.map((f) => f.slice(0, 9));
    expect(p[2]).toBe('#########'); // panza cerrada
    expect(p[14]).toBe('###......'); // el asta baja sola
    // primera I: la P ocupa 9 columnas + 3 de aire
    const i = WORDMARK_BITMAP.map((f) => f.slice(12, 15));
    for (const fila of i) expect(fila).toBe('###');
  });

  test('la X tiene el cruce resuelto en el centro exacto', () => {
    const x = WORDMARK_BITMAP.map((f) => f.slice(18, 29));
    expect(x[7]).toBe('....###....');
    expect(x[0]).toBe('###.....###');
    expect(x[14]).toBe('###.....###');
  });
});
