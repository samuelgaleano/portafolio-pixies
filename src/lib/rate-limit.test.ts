import { describe, expect, test, vi } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('createRateLimiter', () => {
  test('permite hasta maxPerWindow peticiones y bloquea la siguiente', () => {
    const limiter = createRateLimiter(60_000, 3);
    expect(limiter.isLimited('1.1.1.1')).toBe(false);
    expect(limiter.isLimited('1.1.1.1')).toBe(false);
    expect(limiter.isLimited('1.1.1.1')).toBe(false);
    expect(limiter.isLimited('1.1.1.1')).toBe(true);
  });

  test('cada IP tiene su propio contador', () => {
    const limiter = createRateLimiter(60_000, 1);
    expect(limiter.isLimited('1.1.1.1')).toBe(false);
    expect(limiter.isLimited('1.1.1.1')).toBe(true);
    expect(limiter.isLimited('2.2.2.2')).toBe(false);
  });

  test('pasada la ventana, vuelve a permitir', () => {
    vi.useFakeTimers();
    const limiter = createRateLimiter(1000, 1);
    expect(limiter.isLimited('1.1.1.1')).toBe(false);
    expect(limiter.isLimited('1.1.1.1')).toBe(true);
    vi.advanceTimersByTime(1001);
    expect(limiter.isLimited('1.1.1.1')).toBe(false);
    vi.useRealTimers();
  });

  test('reset() limpia todos los contadores', () => {
    const limiter = createRateLimiter(60_000, 1);
    limiter.isLimited('1.1.1.1');
    limiter.isLimited('1.1.1.1');
    limiter.reset();
    expect(limiter.isLimited('1.1.1.1')).toBe(false);
  });
});
