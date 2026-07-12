import { NextResponse } from 'next/server';
import { validateLead, type LeadPayload } from '@/lib/leads';

// POST /api/leads (plan F5 §2.1): valida en el servidor, oculta la URL del Apps Script
// y CONFIRMA el guardado real antes de que el cliente redirija a WhatsApp.

// Rate limit en memoria por IP: 5/min. Suficiente para un formulario de contacto en
// Fluid Compute (instancias reutilizadas); si algún día hace falta más, mover a KV.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function __resetRateLimit() {
  hits.clear();
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: Partial<LeadPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'validacion', campos: ['body'] }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (rateLimited(ip)) return NextResponse.json({ error: 'rate' }, { status: 429 });

  // Honeypot: a los bots se les responde "ok" sin guardar (no avisarles que fallaron).
  if (body.website) return NextResponse.json({ ok: true });

  const valid = validateLead(body);
  if (!valid.ok) return NextResponse.json({ error: 'validacion', campos: valid.campos }, { status: 400 });

  const url = process.env.LEADS_WEBHOOK_URL;
  const secret = process.env.LEADS_SECRET;
  if (!url || !secret) {
    console.error('[leads] LEADS_WEBHOOK_URL / LEADS_SECRET sin configurar');
    return NextResponse.json({ error: 'config' }, { status: 500 });
  }

  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      secret,
      nombre: body.nombre,
      contacto: body.contacto,
      empresa: body.empresa ?? '',
      tipoProyecto: body.tipoProyecto,
      mensaje: body.mensaje ?? '',
      desde: body.desde ?? 'directo',
      userAgent: req.headers.get('user-agent') ?? '',
    }),
    // Apps Script responde rápido; si se cuelga, mejor fallar y mostrar alternativas.
    signal: AbortSignal.timeout(8000),
  }).catch(() => null);

  if (!upstream || !upstream.ok) return NextResponse.json({ error: 'guardado' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
