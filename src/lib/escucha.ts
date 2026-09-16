// Demo lite de escuchacomprendiendo.ai (§ plan "productos propios"). Validación pura: se usa
// en cliente (UX) y servidor (frontera de confianza), sin dependencias — mismo espíritu que
// src/lib/leads.ts. El pipeline real (audio → transcripción → contexto citado) corre en la
// app de escritorio con Claude; esta demo es una versión liviana propia, a costo $0, sobre
// Groq (capa gratuita) para transcripción Y estructuración.

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface EscuchaCitedItem {
  texto: string;
  citas: number[]; // segundo (start) del segmento de donde sale la afirmación
}

export interface EscuchaArea {
  nombre: string;
  conceptos: EscuchaCitedItem[];
  decisiones: EscuchaCitedItem[];
  tareas: EscuchaCitedItem[];
  riesgos: EscuchaCitedItem[];
  noSeSabe: EscuchaCitedItem[];
}

export interface EscuchaStructured {
  resumen: string;
  areas: EscuchaArea[];
}

export type EscuchaValidation = { ok: true } | { ok: false; detalle: string };

// 4 MB: margen bajo el tope FIJO de 4.5 MB del body de una función serverless de Vercel
// (no configurable, igual en Hobby/Pro) — no es una elección de producto, es la infraestructura.
const MAX_AUDIO_BYTES = 4 * 1024 * 1024;
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/ogg'];
const ALLOWED_AUDIO_EXT = ['.mp3', '.m4a', '.wav', '.webm', '.ogg'];

export function validateAudioFile(meta: { size: number; type: string; name: string }): EscuchaValidation {
  if (!meta.size) return { ok: false, detalle: 'vacio' };
  if (meta.size > MAX_AUDIO_BYTES) return { ok: false, detalle: 'tamano' };
  const name = meta.name.toLowerCase();
  // el Content-Type que declara el navegador varía por SO/codec — la extensión es la señal
  // más estable; alcanza con que UNA de las dos confirme un formato soportado
  const extOk = ALLOWED_AUDIO_EXT.some((ext) => name.endsWith(ext));
  if (!extOk && !ALLOWED_AUDIO_TYPES.includes(meta.type)) return { ok: false, detalle: 'formato' };
  return { ok: true };
}

// La demo solo estructura los primeros 90s del audio — tope real de costo/latencia,
// independiente de cuánto dure el archivo que realmente se recibió.
const MAX_WINDOW_SECONDS = 90;
const MAX_SEGMENTS = 60;

export function clampSegmentsToWindow(segments: TranscriptSegment[], maxSeconds = MAX_WINDOW_SECONDS): TranscriptSegment[] {
  return segments.filter((s) => s.start <= maxSeconds).slice(0, MAX_SEGMENTS);
}

// Defensa si alguna vez se llama /structure directo (sin pasar por /transcribe primero):
// un transcript fabricado no puede ser arbitrariamente grande.
const MAX_TRANSCRIPT_CHARS = 6000;
const MAX_TRANSCRIPT_SEGMENTS = 200;

function isTranscriptSegment(v: unknown): v is TranscriptSegment {
  if (!v || typeof v !== 'object') return false;
  const s = v as Partial<TranscriptSegment>;
  return typeof s.start === 'number' && typeof s.end === 'number' && typeof s.text === 'string';
}

export function validateTranscriptForStructuring(v: unknown): EscuchaValidation {
  if (!v || typeof v !== 'object') return { ok: false, detalle: 'transcript-invalido' };
  const t = v as { text?: unknown; segments?: unknown };
  if (typeof t.text !== 'string' || !t.text.trim() || t.text.length > MAX_TRANSCRIPT_CHARS) {
    return { ok: false, detalle: 'transcript-invalido' };
  }
  if (!Array.isArray(t.segments) || t.segments.length > MAX_TRANSCRIPT_SEGMENTS) {
    return { ok: false, detalle: 'transcript-invalido' };
  }
  if (!t.segments.every(isTranscriptSegment)) return { ok: false, detalle: 'transcript-invalido' };
  return { ok: true };
}

function parseCitedList(v: unknown): EscuchaCitedItem[] | null {
  if (!Array.isArray(v)) return null;
  const out: EscuchaCitedItem[] = [];
  for (const item of v) {
    if (!item || typeof item !== 'object') return null;
    const it = item as Partial<EscuchaCitedItem>;
    if (typeof it.texto !== 'string') return null;
    const citas = Array.isArray(it.citas) ? it.citas.filter((c): c is number => typeof c === 'number') : [];
    out.push({ texto: it.texto, citas });
  }
  return out;
}

// Parseo defensivo de la respuesta del LLM: nunca confiar en que devolvió JSON válido con
// la forma exacta pedida — un modelo puede alucinar un campo faltante o un tipo distinto.
export function parseStructuredResponse(raw: string): EscuchaStructured | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const p = parsed as { resumen?: unknown; areas?: unknown };
  if (typeof p.resumen !== 'string' || !Array.isArray(p.areas)) return null;

  const areas: EscuchaArea[] = [];
  for (const a of p.areas) {
    if (!a || typeof a !== 'object') return null;
    const area = a as Record<string, unknown>;
    if (typeof area.nombre !== 'string') return null;
    const conceptos = parseCitedList(area.conceptos);
    const decisiones = parseCitedList(area.decisiones);
    const tareas = parseCitedList(area.tareas);
    const riesgos = parseCitedList(area.riesgos);
    const noSeSabe = parseCitedList(area.noSeSabe);
    if (!conceptos || !decisiones || !tareas || !riesgos || !noSeSabe) return null;
    areas.push({ nombre: area.nombre, conceptos, decisiones, tareas, riesgos, noSeSabe });
  }

  return { resumen: p.resumen, areas };
}
