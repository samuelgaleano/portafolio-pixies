import { describe, expect, it } from 'vitest';
import { bogotaTime } from './clock';

describe('bogotaTime', () => {
  it('convierte UTC a America/Bogota (GMT-5, sin DST)', () => {
    // 2026-07-14T15:30:45Z → 10:30:45 en Bogotá
    expect(bogotaTime(new Date('2026-07-14T15:30:45Z'))).toBe('10:30:45');
  });

  it('cruza medianoche correctamente', () => {
    // 03:05:09Z → 22:05:09 del día anterior en Bogotá
    expect(bogotaTime(new Date('2026-07-14T03:05:09Z'))).toBe('22:05:09');
  });
});
