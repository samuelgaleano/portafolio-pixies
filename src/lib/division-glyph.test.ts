import { describe, expect, test } from 'vitest';
import { LETRAS, ICONOS, celdasEncendidas } from './division-glyph';

describe('celdasEncendidas — bitmap 5×7 → índices 0–34 encendidos', () => {
  test('bitmap vacío no enciende ninguna celda', () => {
    expect(celdasEncendidas(['00000', '00000', '00000', '00000', '00000', '00000', '00000'])).toEqual([]);
  });

  test('primera fila entera enciende las celdas 0–4', () => {
    expect(celdasEncendidas(['11111', '00000', '00000', '00000', '00000', '00000', '00000'])).toEqual([0, 1, 2, 3, 4]);
  });

  test('última celda (fila 6, columna 4) es el índice 34', () => {
    expect(celdasEncendidas(['00000', '00000', '00000', '00000', '00000', '00000', '00001'])).toEqual([34]);
  });
});

describe('LETRAS / ICONOS — cada bitmap tiene 7 filas de 5 bits', () => {
  test.each(['M', 'W'] as const)('LETRAS.%s tiene 7×5', (letra) => {
    expect(LETRAS[letra]).toHaveLength(7);
    for (const fila of LETRAS[letra]) expect(fila).toHaveLength(5);
  });

  test.each(['M', 'W'] as const)('ICONOS.%s tiene 7×5', (letra) => {
    expect(ICONOS[letra]).toHaveLength(7);
    for (const fila of ICONOS[letra]) expect(fila).toHaveLength(5);
  });

  test('el corazón de M no usa esquinas redondeadas de emoji: fila central completa (bloque duro)', () => {
    expect(ICONOS.M[1]).toBe('11111');
    expect(ICONOS.M[2]).toBe('11111');
  });
});
