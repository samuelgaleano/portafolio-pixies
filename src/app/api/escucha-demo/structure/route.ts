import { NextResponse } from 'next/server';
import { validateTranscriptForStructuring, parseStructuredResponse, type TranscriptSegment } from '@/lib/escucha';
import { createRateLimiter } from '@/lib/rate-limit';

// POST /api/escucha-demo/structure — segunda etapa de la demo lite (§ plan "productos
// propios"). Recibe el transcript que ya devolvió /transcribe y lo estructura en conceptos,
// decisiones, tareas, riesgos y "lo que no se sabe" citados, con Groq (capa gratuita, $0
// costo, mismo proveedor que la transcripción — nunca toca la API de Anthropic de pago).
//
// Modelo: openai/gpt-oss-120b, NO llama-3.3-70b-versatile — Groq movió ese último a
// precio Enterprise/Contact Sales el 2026-08-26 (verificado contra console.groq.com/docs
// el 2026-09-17), sale por completo del free tier. gpt-oss-120b sigue gratis con los
// mismos límites (30 RPM / 1.000 RPD / 8.000 TPM / 200.000 TPD).
export const runtime = 'nodejs';
export const maxDuration = 25;

const limiter = createRateLimiter(10 * 60_000, 6);

export function __resetRateLimit() {
  limiter.reset();
}

// 2026-09-23 (Samuel): "transcribir y resumir lo hace Whisper y otras aplicaciones; quiero
// que se vea el valor agregado". Por eso el prompt ya no pide solo listas: pide también el
// GRAFO (nodos + vínculos) y el nivel de CERTEZA de cada ítem, que son las dos cosas que
// distinguen a la app — estructurar y relacionar, y no presentar como hecho lo que fue una
// deducción. Ambos campos se parsean de forma tolerante: si el modelo los omite o los
// devuelve mal, el resto del resultado sigue sirviendo (ver parseGrafo en lib/escucha.ts).
const SYSTEM_PROMPT = `Eres un analista que estructura transcripciones de audio en contexto citado y relacionado.
A partir del transcript con segmentos con timestamp que recibes, devuelve SOLO un objeto JSON
(sin texto alrededor, sin markdown, sin backticks) con esta forma exacta:
{
  "resumen": "1-2 frases de qué trata el audio",
  "areas": [
    {
      "nombre": "nombre corto del área o tema",
      "conceptos": [{ "texto": "afirmación breve", "citas": [12.4], "certeza": "afirmado" }],
      "decisiones": [{ "texto": "...", "citas": [45.1], "certeza": "afirmado" }],
      "tareas": [{ "texto": "...", "citas": [50.0], "certeza": "implicito" }],
      "riesgos": [{ "texto": "...", "citas": [61.3], "certeza": "incierto" }],
      "noSeSabe": [{ "texto": "...", "citas": [70.0], "certeza": "incierto" }]
    }
  ],
  "nodos": [{ "id": "n1", "etiqueta": "nombre corto de la pieza", "tipo": "concepto" }],
  "vinculos": [{ "de": "n1", "a": "n2", "relacion": "verbo corto que los une" }]
}
Las "citas" son el valor "start" (en segundos) del segmento de donde sale cada afirmación —
nunca inventes un número que no esté entre los segmentos recibidos. Si una lista queda vacía,
devuélvela como array vacío, nunca la omitas. Máximo 3 áreas, máximo 5 ítems por lista.

"certeza" indica cuánto sostiene el audio esa afirmación, y es obligatoria en cada ítem:
- "afirmado": se dijo explícitamente, casi con esas palabras.
- "implicito": se deduce de lo dicho, pero nadie lo dijo así.
- "incierto": quedó en el aire, a medias o en duda.
Prefiere "implicito" o "incierto" antes que forzar un "afirmado": marcar de menos es un error
más grave que marcar de más.

"nodos" y "vinculos" son el grafo de contexto: las piezas con nombre propio que aparecen en el
audio y cómo se relacionan. "tipo" es uno de: concepto, decision, tarea, riesgo, persona. Los
"id" son cortos y únicos ("n1", "n2", ...). En "vinculos", "de" y "a" DEBEN ser ids que existan
en "nodos" — nunca inventes un id. Entre 3 y 10 nodos y entre 2 y 12 vínculos; si el audio no
da para relacionar nada, devuelve ambos como arrays vacíos antes que inventar relaciones.`;

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
      model: 'openai/gpt-oss-120b',
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
