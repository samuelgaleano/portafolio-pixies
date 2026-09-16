import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { POST, __resetRateLimit } from './route';

const validStructured = {
  resumen: 'resumen',
  areas: [
    { nombre: 'Área 1', conceptos: [{ texto: 'c1', citas: [1.2] }], decisiones: [], tareas: [], riesgos: [], noSeSabe: [] },
  ],
};

const okUpstream = () =>
  vi.fn().mockImplementation(
    async () =>
      new Response(
        JSON.stringify({ choices: [{ message: { content: JSON.stringify(validStructured) } }] }),
        { status: 200 }
      )
  );

function req(transcript: unknown, ip = '1.2.3.4') {
  return new Request('http://test/api/escucha-demo/structure', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify({ transcript }),
  });
}

const transcript = { text: 'hola mundo', segments: [{ start: 0, end: 2, text: 'hola mundo' }] };

beforeEach(() => {
  vi.stubEnv('GROQ_API_KEY', 'gsk_test');
  vi.stubGlobal('fetch', okUpstream());
  __resetRateLimit();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('POST /api/escucha-demo/structure', () => {
  test('camino feliz: 200 con structured, llama a Groq chat', async () => {
    const res = await POST(req(transcript));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, structured: validStructured });
    const f = fetch as ReturnType<typeof vi.fn>;
    expect(f).toHaveBeenCalledTimes(1);
    expect(f.mock.calls[0][0]).toBe('https://api.groq.com/openai/v1/chat/completions');
  });

  test('transcript inválido (fabricado, sin text) → 400, no llama a Groq', async () => {
    const res = await POST(req({ segments: [] }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'validacion', detalle: 'transcript-invalido' });
    expect(fetch).not.toHaveBeenCalled();
  });

  test('transcript fabricado gigante → 400, no llama a Groq', async () => {
    const res = await POST(req({ text: 'a'.repeat(7000), segments: [] }));
    expect(res.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  test('JSON del body malformado → 400', async () => {
    const bad = new Request('http://test/api/escucha-demo/structure', { method: 'POST', body: 'no-json{{' });
    const res = await POST(bad);
    expect(res.status).toBe(400);
  });

  test('Groq caído → 502 proveedor', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('boom', { status: 500 })));
    const res = await POST(req(transcript));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'proveedor' });
  });

  test('Groq responde JSON malformado en el content → 502 proveedor, no explota', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: '{roto' } }] }), { status: 200 }))
    );
    const res = await POST(req(transcript));
    expect(res.status).toBe(502);
  });

  test('sin GROQ_API_KEY → 500 config', async () => {
    vi.stubEnv('GROQ_API_KEY', '');
    const res = await POST(req(transcript));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'config' });
    expect(fetch).not.toHaveBeenCalled();
  });

  test('rate limit: la 7ª petición del mismo IP en la ventana → 429', async () => {
    for (let i = 0; i < 6; i++) expect((await POST(req(transcript, '9.9.9.9'))).status).toBe(200);
    expect((await POST(req(transcript, '9.9.9.9'))).status).toBe(429);
    expect((await POST(req(transcript, '8.8.8.8'))).status).toBe(200);
  });
});
