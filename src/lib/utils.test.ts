import { describe, expect, test } from 'vitest';
import { formatDate } from './utils';
import { readingTime } from './reading-time';

describe('formatDate — regresión del bug de zona horaria (fecha-solo se corría un día en UTC-5)', () => {
  test('una fecha-solo de frontmatter (medianoche UTC) formatea el día correcto', () => {
    expect(formatDate(new Date('2026-07-11'))).toBe('11 de julio de 2026');
  });

  test('primer día del año no se corre al año anterior', () => {
    expect(formatDate(new Date('2026-01-01'))).toBe('1 de enero de 2026');
  });
});

describe('readingTime — ~200 palabras/min, mínimo 1', () => {
  test('texto vacío devuelve 1', () => {
    expect(readingTime('')).toBe(1);
  });

  test('200 palabras ≈ 1 minuto', () => {
    expect(readingTime(Array(200).fill('palabra').join(' '))).toBe(1);
  });

  test('600 palabras ≈ 3 minutos', () => {
    expect(readingTime(Array(600).fill('palabra').join(' '))).toBe(3);
  });
});
