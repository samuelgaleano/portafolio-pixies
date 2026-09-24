// Demo lite de escuchacomprendiendo.IA (§ plan "productos propios"). Validación pura: se usa
// en cliente (UX) y servidor (frontera de confianza), sin dependencias — mismo espíritu que
// src/lib/leads.ts. El pipeline real (audio → transcripción → contexto citado) corre en la
// app de escritorio con Claude; esta demo es una versión liviana propia, a costo $0, sobre
// Groq (capa gratuita) para transcripción Y estructuración.

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

/** Qué tan sostenida está una afirmación por lo que REALMENTE se dijo en el audio.
 * Es la pieza anti-alucinación: en vez de presentar todo con la misma seguridad, cada ítem
 * dice si se afirmó tal cual, si se dedujo, o si quedó en el aire (Samuel, 2026-09-23). */
export type EscuchaCerteza = 'afirmado' | 'implicito' | 'incierto';

export interface EscuchaCitedItem {
  texto: string;
  citas: number[]; // segundo (start) del segmento de donde sale la afirmación
  certeza?: EscuchaCerteza;
}

/** Nodo del grafo de contexto: una pieza con nombre propio que salió del audio. */
export interface EscuchaNodo {
  id: string;
  etiqueta: string;
  tipo: 'concepto' | 'decision' | 'tarea' | 'riesgo' | 'persona';
}

/** Vínculo entre dos nodos. `relacion` es el verbo que los une, en palabras del audio. */
export interface EscuchaVinculo {
  de: string;
  a: string;
  relacion: string;
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
  /** El grafo de contexto. Opcional a propósito: si el modelo no lo devuelve, el resto del
   * resultado sigue siendo válido y la vista de grafo simplemente no aparece — nunca se
   * inventa un grafo para rellenar. */
  nodos?: EscuchaNodo[];
  vinculos?: EscuchaVinculo[];
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

const CERTEZAS: EscuchaCerteza[] = ['afirmado', 'implicito', 'incierto'];

function parseCitedList(v: unknown): EscuchaCitedItem[] | null {
  if (!Array.isArray(v)) return null;
  const out: EscuchaCitedItem[] = [];
  for (const item of v) {
    if (!item || typeof item !== 'object') return null;
    const it = item as Partial<EscuchaCitedItem>;
    if (typeof it.texto !== 'string') return null;
    const citas = Array.isArray(it.citas) ? it.citas.filter((c): c is number => typeof c === 'number') : [];
    const certeza = CERTEZAS.includes(it.certeza as EscuchaCerteza) ? (it.certeza as EscuchaCerteza) : undefined;
    out.push({ texto: it.texto, citas, ...(certeza ? { certeza } : {}) });
  }
  return out;
}

const TIPOS_NODO: EscuchaNodo['tipo'][] = ['concepto', 'decision', 'tarea', 'riesgo', 'persona'];
const MAX_NODOS = 12;
const MAX_VINCULOS = 18;

/** El grafo se parsea SIN poder tumbar el resto del resultado: si viene mal, se descarta y
 * el usuario ve el contexto igual. Y se limpia de vínculos colgantes — un vínculo que apunta
 * a un nodo que no existe es exactamente la alucinación que la app dice evitar, así que no
 * puede llegar a la pantalla. */
function parseGrafo(rawNodos: unknown, rawVinculos: unknown): { nodos: EscuchaNodo[]; vinculos: EscuchaVinculo[] } {
  if (!Array.isArray(rawNodos)) return { nodos: [], vinculos: [] };

  const nodos: EscuchaNodo[] = [];
  const vistos = new Set<string>();
  for (const n of rawNodos) {
    if (!n || typeof n !== 'object') continue;
    const nodo = n as Partial<EscuchaNodo>;
    if (typeof nodo.id !== 'string' || !nodo.id.trim()) continue;
    if (typeof nodo.etiqueta !== 'string' || !nodo.etiqueta.trim()) continue;
    if (vistos.has(nodo.id)) continue;
    const tipo = TIPOS_NODO.includes(nodo.tipo as EscuchaNodo['tipo']) ? (nodo.tipo as EscuchaNodo['tipo']) : 'concepto';
    vistos.add(nodo.id);
    nodos.push({ id: nodo.id, etiqueta: nodo.etiqueta, tipo });
    if (nodos.length >= MAX_NODOS) break;
  }

  const vinculos: EscuchaVinculo[] = [];
  if (Array.isArray(rawVinculos)) {
    for (const v of rawVinculos) {
      if (!v || typeof v !== 'object') continue;
      const vin = v as Partial<EscuchaVinculo>;
      if (typeof vin.de !== 'string' || typeof vin.a !== 'string') continue;
      if (vin.de === vin.a || !vistos.has(vin.de) || !vistos.has(vin.a)) continue;
      vinculos.push({ de: vin.de, a: vin.a, relacion: typeof vin.relacion === 'string' ? vin.relacion : '' });
      if (vinculos.length >= MAX_VINCULOS) break;
    }
  }

  // un grafo de un solo nodo o sin vínculos no aporta nada visualmente: mejor no mostrarlo
  if (nodos.length < 2 || vinculos.length === 0) return { nodos: [], vinculos: [] };
  return { nodos, vinculos };
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
  const p = parsed as { resumen?: unknown; areas?: unknown; nodos?: unknown; vinculos?: unknown };
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

  const { nodos, vinculos } = parseGrafo(p.nodos, p.vinculos);
  return { resumen: p.resumen, areas, ...(nodos.length ? { nodos, vinculos } : {}) };
}
