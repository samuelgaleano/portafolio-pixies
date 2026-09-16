import { NextResponse } from 'next/server';
import { validateTranscriptForStructuring, parseStructuredResponse, type TranscriptSegment } from '@/lib/escucha';
import { createRateLimiter } from '@/lib/rate-limit';

// POST /api/escucha-demo/structure — segunda etapa de la demo lite (§ plan "productos
// propios"). Recibe el transcript que ya devolvió /transcribe y lo estructura en conceptos,
// decisiones, tareas, riesgos y "lo que no se sabe" citados, con Groq (capa gratuita, $0
// costo, mismo proveedor que la transcripción — nunca toca la API de Anthropic de pago).
export const runtime = 'nodejs';
export const maxDuration = 25;

const limiter = createRateLimiter(10 * 60_000, 6);

export function __resetRateLimit() {
  limiter.reset();
}

const SYSTEM_PROMPT = `Sos un analista que estructura transcripciones de audio en contexto citado.
A partir del transcript con segmentos con timestamp que te pasan, devolvé SOLO un objeto JSON
(sin texto alrededor, sin markdown, sin backticks) con esta forma exacta:
{
  "resumen": "1-2 frases de qué trata el audio",
  "areas": [
    {
      "nombre": "nombre corto del área o tema",
      "conceptos": [{ "texto": "afirmación breve", "citas": [12.4] }],
      "decisiones": [{ "texto": "...", "citas": [45.1] }],
      "tareas": [{ "texto": "...", "citas": [50.0] }],
      "riesgos": [{ "texto": "...", "citas": [61.3] }],
      "noSeSabe": [{ "texto": "...", "citas": [70.0] }]
    }
  ]
}
Las "citas" son el valor "start" (en segundos) del segmento de donde sale cada afirmación —
nunca inventes un número que no esté entre los segmentos recibidos. Si una lista queda vacía,
devolvela como array vacío, nunca la omitas. Máximo 3 áreas, máximo 5 ítems por lista.`;

interface GroqChatCompletion {
  choices?: Array<{ message?: { content?: string } }>;
}

export async function POST(req: Request): Promise<NextResponse> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (limiter.isLimited(ip)) return NextResponse.json({ error: 'rate' }, { status: 429 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('[escucha-demo] GROQ_API_KEY sin configurar');
    return NextResponse.json({ error: 'config' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'validacion', detalle: 'body' }, { status: 400 });
  }

  const { transcript } = (body ?? {}) as { transcript?: unknown };
  const valid = validateTranscriptForStructuring(transcript);
  if (!valid.ok) return NextResponse.json({ error: 'validacion', detalle: valid.detalle }, { status: 400 });

  const t = transcript as { text: string; segments: TranscriptSegment[] };

  const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: JSON.stringify({ text: t.text, segments: t.segments }) },
      ],
    }),
    signal: AbortSignal.timeout(20_000),
  }).catch(() => null);

  if (!upstream || !upstream.ok) return NextResponse.json({ error: 'proveedor' }, { status: 502 });

  // Nunca loguear el contenido de la respuesta — solo el resultado de validación (§ privacidad).
  const data = (await upstream.json().catch(() => null)) as GroqChatCompletion | null;
  const raw = data?.choices?.[0]?.message?.content;
  if (!raw) return NextResponse.json({ error: 'proveedor' }, { status: 502 });

  const structured = parseStructuredResponse(raw);
  if (!structured) return NextResponse.json({ error: 'proveedor' }, { status: 502 });

  return NextResponse.json({ ok: true, structured });
}
