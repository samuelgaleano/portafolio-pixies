import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { POST, __resetRateLimit } from './route';

// Única frontera mockeada: el fetch saliente al Apps Script (servicio externo).
const okUpstream = () =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

function req(body: unknown, ip = '1.2.3.4') {
  return new Request('http://test/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

const lead = {
  nombre: 'Ana Pérez',
  contacto: 'ana@ejemplo.com',
  tipoProyecto: 'Landing page',
  desde: 'landing',
};

beforeEach(() => {
  vi.stubEnv('LEADS_WEBHOOK_URL', 'https://script.example/exec');
  vi.stubEnv('LEADS_SECRET', 's3cr3t');
  vi.stubGlobal('fetch', okUpstream());
  __resetRateLimit();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('POST /api/leads (handler, plan F5 §2.1)', () => {
  test('camino feliz: 200 {ok:true} y reenvía al Apps Script con el secret', async () => {
    const res = await POST(req(lead));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const f = fetch as ReturnType<typeof vi.fn>;
    expect(f).toHaveBeenCalledTimes(1);
    const [url, init] = f.mock.calls[0];
    expect(url).toBe('https://script.example/exec');
    const sent = JSON.parse((init as RequestInit).body as string);
    expect(sent.secret).toBe('s3cr3t');
    expect(sent.nombre).toBe('Ana Pérez');
    expect(sent.desde).toBe('landing');
  });

  test('validación falla → 400 con campos y NO llama al upstream', async () => {
    const res = await POST(req({ ...lead, nombre: '' }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'validacion', campos: ['nombre'] });
    expect(fetch).not.toHaveBeenCalled();
  });

  test('honeypot lleno → 200 "ok" silencioso SIN reenviar (no avisar al bot)', async () => {
    const res = await POST(req({ ...lead, website: 'spam.com' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetch).not.toHaveBeenCalled();
  });

  test('upstream caído → 502 {error:"guardado"} (el cliente muestra alternativas)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('boom', { status: 500 })));
    const res = await POST(req(lead));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'guardado' });
  });

  test('env sin configurar → 500 {error:"config"} (falla ruidosa, no silencio)', async () => {
    vi.stubEnv('LEADS_WEBHOOK_URL', '');
    const res = await POST(req(lead));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'config' });
  });

  test('rate limit: la 6ª petición del mismo IP en la ventana → 429', async () => {
    for (let i = 0; i < 5; i++) expect((await POST(req(lead, '9.9.9.9'))).status).toBe(200);
    expect((await POST(req(lead, '9.9.9.9'))).status).toBe(429);
    // otro IP no se ve afectado
    expect((await POST(req(lead, '8.8.8.8'))).status).toBe(200);
  });

  test('JSON malformado → 400 sin explotar', async () => {
    const bad = new Request('http://test/api/leads', { method: 'POST', body: 'no-json{{' });
    const res = await POST(bad);
    expect(res.status).toBe(400);
  });
});
