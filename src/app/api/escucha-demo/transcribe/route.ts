import { NextResponse } from 'next/server';
import { validateAudioFile, clampSegmentsToWindow, type TranscriptSegment } from '@/lib/escucha';

// POST /api/escucha-demo/transcribe — primera etapa de la demo lite de escuchacomprendiendo.ai
// (§ plan "productos propios"). Recibe un audio corto, lo transcribe con Groq (capa gratuita,
// $0 costo) y devuelve texto + segmentos con timestamp. El audio nunca se persiste: vive en
// memoria de la función mientras dura la petición y se descarta al responder.
export const runtime = 'nodejs';
export const maxDuration = 45;

// Rate limit en memoria por IP, calcado de api/leads/route.ts (Fluid Compute reutiliza
// instancias). Bucket propio, no compartido con /structure — cada etapa tiene su propio costo.
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 4;
const hits = new Map<string, number[]>();

export function __resetRateLimit() {
  hits.clear();
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 1000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

// Tope diario blando: deja ~8x de margen bajo el RPD más bajo de Groq gratis (1.000/día en
// el modelo de chat) para reintentos y fallos, sin arriesgar la cuota compartida del día.
const DAILY_CAP = 120;
const DAILY_MS = 24 * 60 * 60_000;
let dailyCount = 0;
let dailyResetAt = 0;

export function __resetDailyCap() {
  dailyCount = 0;
  dailyResetAt = 0;
}

function dailyCapExceeded(): boolean {
  const now = Date.now();
  if (now > dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = now + DAILY_MS;
  }
  dailyCount += 1;
  return dailyCount > DAILY_CAP;
}

interface GroqTranscription {
  text?: string;
  duration?: number;
  segments?: Array<{ start: number; end: number; text: string }>;
}

export async function POST(req: Request): Promise<NextResponse> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (rateLimited(ip)) return NextResponse.json({ error: 'rate' }, { status: 429 });
  if (dailyCapExceeded()) return NextResponse.json({ error: 'cupo-diario' }, { status: 429 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('[escucha-demo] GROQ_API_KEY sin configurar');
    return NextResponse.json({ error: 'config' }, { status: 500 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'validacion', detalle: 'body' }, { status: 400 });
  }

  const audio = form.get('audio');
  if (!(audio instanceof File)) {
    return NextResponse.json({ error: 'validacion', detalle: 'vacio' }, { status: 400 });
  }

  const valid = validateAudioFile({ size: audio.size, type: audio.type, name: audio.name });
  if (!valid.ok) return NextResponse.json({ error: 'validacion', detalle: valid.detalle }, { status: 400 });

  const groqForm = new FormData();
  groqForm.set('file', audio, audio.name);
  groqForm.set('model', 'whisper-large-v3-turbo');
  groqForm.set('response_format', 'verbose_json');

  const upstream = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}` },
    body: groqForm,
    signal: AbortSignal.timeout(40_000),
  }).catch(() => null);

  if (!upstream || !upstream.ok) return NextResponse.json({ error: 'proveedor' }, { status: 502 });

  // Nunca loguear el contenido de la transcripción — solo metadata (§ plan, privacidad).
  const data = (await upstream.json().catch(() => null)) as GroqTranscription | null;
  if (!data?.text || !Array.isArray(data.segments)) return NextResponse.json({ error: 'proveedor' }, { status: 502 });

  const segments: TranscriptSegment[] = clampSegmentsToWindow(
    data.segments.map((s) => ({ start: s.start, end: s.end, text: s.text }))
  );

  return NextResponse.json({
    ok: true,
    durationSec: data.duration ?? segments.at(-1)?.end ?? 0,
    transcript: { text: data.text, segments },
  });
}
