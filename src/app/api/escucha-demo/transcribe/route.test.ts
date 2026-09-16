import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { POST, __resetRateLimit, __resetDailyCap } from './route';

const okUpstream = () =>
  vi.fn().mockImplementation(
    async () =>
      new Response(
        JSON.stringify({
          text: 'hola mundo',
          duration: 4.2,
          segments: [{ start: 0, end: 2, text: 'hola' }, { start: 2, end: 4.2, text: 'mundo' }],
        }),
        { status: 200 }
      )
  );

function audioFile(bytes = 1000, name = 'nota.mp3', type = 'audio/mpeg') {
  return new File([new Uint8Array(bytes)], name, { type });
}

function req(file: File | null, ip = '1.2.3.4') {
  const form = new FormData();
  if (file) form.set('audio', file);
  return new Request('http://test/api/escucha-demo/transcribe', {
    method: 'POST',
    headers: { 'x-forwarded-for': ip },
    body: form,
  });
}

beforeEach(() => {
  vi.stubEnv('GROQ_API_KEY', 'gsk_test');
  vi.stubGlobal('fetch', okUpstream());
  __resetRateLimit();
  __resetDailyCap();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('POST /api/escucha-demo/transcribe', () => {
  test('camino feliz: 200 con transcript y segmentos, llama a Groq whisper', async () => {
    const res = await POST(req(audioFile()));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.transcript.text).toBe('hola mundo');
    expect(body.transcript.segments).toHaveLength(2);
    const f = fetch as ReturnType<typeof vi.fn>;
    expect(f).toHaveBeenCalledTimes(1);
    expect(f.mock.calls[0][0]).toBe('https://api.groq.com/openai/v1/audio/transcriptions');
  });

  test('sin archivo → 400 vacio, no llama a Groq', async () => {
    const res = await POST(req(null));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'validacion', detalle: 'vacio' });
    expect(fetch).not.toHaveBeenCalled();
  });

  test('archivo demasiado grande → 400 tamano', async () => {
    const res = await POST(req(audioFile(5 * 1024 * 1024)));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'validacion', detalle: 'tamano' });
    expect(fetch).not.toHaveBeenCalled();
  });

  test('formato no soportado → 400 formato', async () => {
    const res = await POST(req(audioFile(1000, 'video.mov', 'video/quicktime')));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'validacion', detalle: 'formato' });
    expect(fetch).not.toHaveBeenCalled();
  });

  test('Groq caído → 502 proveedor', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('boom', { status: 500 })));
    const res = await POST(req(audioFile()));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'proveedor' });
  });

  test('Groq responde 200 pero sin texto → 502 proveedor', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({}), { status: 200 })));
    const res = await POST(req(audioFile()));
    expect(res.status).toBe(502);
  });

  test('sin GROQ_API_KEY → 500 config, no llama a fetch', async () => {
    vi.stubEnv('GROQ_API_KEY', '');
    const res = await POST(req(audioFile()));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'config' });
    expect(fetch).not.toHaveBeenCalled();
  });

  test('rate limit: la 5ª petición del mismo IP en la ventana → 429', async () => {
    for (let i = 0; i < 4; i++) expect((await POST(req(audioFile(), '9.9.9.9'))).status).toBe(200);
    expect((await POST(req(audioFile(), '9.9.9.9'))).status).toBe(429);
    expect((await POST(req(audioFile(), '8.8.8.8'))).status).toBe(200);
  });

  test('cupo diario: la corrida 121 del día → 429 cupo-diario', async () => {
    for (let i = 0; i < 120; i++) {
      const res = await POST(req(audioFile(), `ip-${i}`));
      expect(res.status).toBe(200);
    }
    const res = await POST(req(audioFile(), 'ip-final'));
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: 'cupo-diario' });
  });

  test('segmentos se recortan a la ventana de 90s', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            text: 'largo',
            duration: 120,
            segments: [
              { start: 0, end: 5, text: 'a' },
              { start: 95, end: 100, text: 'fuera de ventana' },
            ],
          }),
          { status: 200 }
        )
      )
    );
    const res = await POST(req(audioFile()));
    const body = await res.json();
    expect(body.transcript.segments).toHaveLength(1);
  });
});
