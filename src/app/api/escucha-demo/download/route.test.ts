import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { POST, __resetRateLimit } from './route';

function req(body: unknown, ip = '1.2.3.4') {
  return new Request('http://test/api/escucha-demo/download', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.stubEnv('ESCUCHA_ACCESS_CODE', 'clave-secreta-123');
  vi.stubEnv('ESCUCHA_DOWNLOAD_URL_NSIS', 'https://example.com/instalador.exe');
  vi.stubEnv('ESCUCHA_DOWNLOAD_URL_PORTABLE', 'https://example.com/portable.exe');
  __resetRateLimit();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('POST /api/escucha-demo/download', () => {
  test('código correcto + variant nsis → 200 con la URL configurada', async () => {
    const res = await POST(req({ code: 'clave-secreta-123', variant: 'nsis' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, url: 'https://example.com/instalador.exe' });
  });

  test('código correcto + variant portable → 200 con la URL portable', async () => {
    const res = await POST(req({ code: 'clave-secreta-123', variant: 'portable' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, url: 'https://example.com/portable.exe' });
  });

  test('código correcto con espacios alrededor (typeo humano) → igual pasa', async () => {
    const res = await POST(req({ code: '  clave-secreta-123  ', variant: 'nsis' }));
    expect(res.status).toBe(200);
  });

  test('ESCUCHA_ACCESS_CODE guardado con salto de línea de más (típico al pegar en Vercel) → igual pasa', async () => {
    vi.stubEnv('ESCUCHA_ACCESS_CODE', 'clave-secreta-123\n');
    const res = await POST(req({ code: 'clave-secreta-123', variant: 'nsis' }));
    expect(res.status).toBe(200);
  });

  test('código incorrecto → 401, sin filtrar la URL', async () => {
    const res = await POST(req({ code: 'lo-que-sea', variant: 'nsis' }));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'codigo' });
  });

  test('código de longitud distinta a la real → 401, no explota (timingSafeEqual con hash)', async () => {
    const res = await POST(req({ code: 'x', variant: 'nsis' }));
    expect(res.status).toBe(401);
  });

  test('código vacío → 400 validacion', async () => {
    const res = await POST(req({ code: '', variant: 'nsis' }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'validacion' });
  });

  test('variant inválida → 400 validacion', async () => {
    const res = await POST(req({ code: 'clave-secreta-123', variant: 'zip' }));
    expect(res.status).toBe(400);
  });

  test('JSON malformado → 400, no explota', async () => {
    const bad = new Request('http://test/api/escucha-demo/download', { method: 'POST', body: 'no-json{{' });
    const res = await POST(bad);
    expect(res.status).toBe(400);
  });

  test('sin ESCUCHA_ACCESS_CODE configurado → 500 config', async () => {
    vi.stubEnv('ESCUCHA_ACCESS_CODE', '');
    const res = await POST(req({ code: 'clave-secreta-123', variant: 'nsis' }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'config' });
  });

  test('código correcto pero falta la URL de esa variante → 500 config', async () => {
    vi.stubEnv('ESCUCHA_DOWNLOAD_URL_NSIS', '');
    const res = await POST(req({ code: 'clave-secreta-123', variant: 'nsis' }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'config' });
  });

  test('rate limit: el 6º intento del mismo IP en la ventana → 429', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await POST(req({ code: 'lo-que-sea', variant: 'nsis' }, '9.9.9.9'));
      expect(res.status).toBe(401);
    }
    const res = await POST(req({ code: 'clave-secreta-123', variant: 'nsis' }, '9.9.9.9'));
    expect(res.status).toBe(429);
    // otro IP no se ve afectado, incluso con el código correcto
    const otro = await POST(req({ code: 'clave-secreta-123', variant: 'nsis' }, '8.8.8.8'));
    expect(otro.status).toBe(200);
  });
});
