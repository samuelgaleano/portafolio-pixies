import { describe, expect, test } from 'vitest';
import { LETRAS, ICONOS, GLYPH_COLS, GLYPH_ROWS, GLYPH_CELDAS, celdasEncendidas, rolesDeCeldas } from './division-glyph';

const vacia = '0'.repeat(GLYPH_COLS);
const bitmapVacio = Array.from({ length: GLYPH_ROWS }, () => vacia);

describe('celdasEncendidas — bitmap 7×9 → índices 0–62 encendidos', () => {
  test('bitmap vacío no enciende ninguna celda', () => {
    expect(celdasEncendidas(bitmapVacio)).toEqual([]);
  });

  test('primera fila entera enciende las celdas 0–6', () => {
    expect(celdasEncendidas(['1'.repeat(GLYPH_COLS), ...bitmapVacio.slice(1)])).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  test('última celda (fila 8, columna 6) es el índice 62', () => {
    expect(celdasEncendidas([...bitmapVacio.slice(0, -1), '0000001'])).toEqual([GLYPH_CELDAS - 1]);
  });
});

describe('LETRAS / ICONOS — cada bitmap tiene 9 filas de 7 bits', () => {
  test.each(['C', 'W'] as const)('LETRAS.%s tiene 9×7', (letra) => {
    expect(LETRAS[letra]).toHaveLength(GLYPH_ROWS);
    for (const fila of LETRAS[letra]) expect(fila).toHaveLength(GLYPH_COLS);
  });

  test.each(['C', 'W'] as const)('ICONOS.%s tiene 9×7', (letra) => {
    expect(ICONOS[letra]).toHaveLength(GLYPH_ROWS);
    for (const fila of ICONOS[letra]) expect(fila).toHaveLength(GLYPH_COLS);
  });

  test('la C está ABIERTA a la derecha (no es una O): ninguna fila central toca la última columna', () => {
    for (const fila of LETRAS.C.slice(2, 7)) expect(fila.endsWith('0')).toBe(true);
    expect(LETRAS.C[0]).toBe('0011110');
  });

  test('el corazón de C no usa esquinas redondeadas de emoji: filas centrales completas (bloque duro)', () => {
    expect(ICONOS.C[2]).toBe('1111111');
    expect(ICONOS.C[3]).toBe('1111111');
    expect(ICONOS.C[4]).toBe('1111111');
    // punta abajo, una sola celda, centrada
    expect(ICONOS.C[7]).toBe('0001000');
  });

  test('el cursor de W es una silueta RELLENA con cabeza triangular y cola separada', () => {
    // la cabeza crece una celda por fila hasta el ancho completo
    expect(ICONOS.W.slice(0, 7)).toEqual(['1000000', '1100000', '1110000', '1111000', '1111100', '1111110', '1111111']);
    // la cola baja hacia la derecha y se separa del borde izquierdo (hay un hueco entre ambos)
    expect(ICONOS.W[7]).toBe('1101100');
    expect(ICONOS.W[8]).toBe('1000110');
  });
});

describe('rolesDeCeldas — el morph letra→ícono es celda por celda', () => {
  test('clasifica cada una de las 63 celdas y no pierde ninguna', () => {
    const roles = rolesDeCeldas(LETRAS.W, ICONOS.W);
    expect(roles).toHaveLength(GLYPH_CELDAS);
    const conteo = { keep: 0, out: 0, in: 0, off: 0 };
    for (const r of roles) conteo[r] += 1;
    expect(conteo.keep + conteo.out).toBe(celdasEncendidas(LETRAS.W).length);
    expect(conteo.keep + conteo.in).toBe(celdasEncendidas(ICONOS.W).length);
  });

  test('una letra idéntica a su ícono solo tiene keep/off (nada que animar)', () => {
    const roles = rolesDeCeldas(LETRAS.C, LETRAS.C);
    expect(roles.filter((r) => r === 'in' || r === 'out')).toHaveLength(0);
  });
});
