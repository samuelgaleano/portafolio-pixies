import { describe, expect, test } from 'vitest';
import { LETRAS, ICONOS, celdasEncendidas, rolesDeCeldas } from './division-glyph';

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

  test('el cursor de W es una silueta RELLENA (cabeza triangular), no un contorno', () => {
    // la cabeza crece una celda por fila hasta el ancho completo
    expect(ICONOS.W.slice(0, 5)).toEqual(['10000', '11000', '11100', '11110', '11111']);
    // y la cola baja hacia la derecha, separada de la cabeza
    expect(ICONOS.W[5]).toBe('00110');
    expect(ICONOS.W[6]).toBe('00011');
  });
});

describe('rolesDeCeldas — el morph letra→ícono es celda por celda', () => {
  test('clasifica cada una de las 35 celdas y no pierde ninguna', () => {
    const roles = rolesDeCeldas(LETRAS.W, ICONOS.W);
    expect(roles).toHaveLength(35);
    const conteo = { keep: 0, out: 0, in: 0, off: 0 };
    for (const r of roles) conteo[r] += 1;
    expect(conteo.keep + conteo.out).toBe(celdasEncendidas(LETRAS.W).length);
    expect(conteo.keep + conteo.in).toBe(celdasEncendidas(ICONOS.W).length);
  });

  test('una letra idéntica a su ícono solo tiene keep/off (nada que animar)', () => {
    const roles = rolesDeCeldas(LETRAS.M, LETRAS.M);
    expect(roles.filter((r) => r === 'in' || r === 'out')).toHaveLength(0);
  });
});
