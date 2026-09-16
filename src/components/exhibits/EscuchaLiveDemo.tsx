'use client';

import { useRef, useState } from 'react';
import { t } from '@/i18n';
import EscuchaResultView from './EscuchaResultView';
import type { EscuchaStructured, TranscriptSegment } from '@/lib/escucha';

type Status =
  | 'idle'
  | 'transcribiendo'
  | 'estructurando'
  | 'resultado'
  | 'transcrito-parcial'
  | 'limite'
  | 'rate-limited'
  | 'saturado';

const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPTED_EXT = ['.mp3', '.m4a', '.wav', '.webm', '.ogg'];

type Transcript = { text: string; segments: TranscriptSegment[] };

// Modo lite en vivo (§ plan "productos propios"): sube un audio corto, lo transcribe y
// estructura de verdad con Groq (capa gratuita, $0 costo). Nunca persiste el archivo — vive
// en memoria del navegador (URL.createObjectURL) y de la función serverless mientras dura
// la petición.
export default function EscuchaLiveDemo({ onFallbackToCurated }: { onFallbackToCurated: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [structured, setStructured] = useState<EscuchaStructured | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setStatus('idle');
    setErrorMsg(null);
    setTranscript(null);
    setStructured(null);
  };

  const validateClient = (file: File): string | null => {
    const name = file.name.toLowerCase();
    if (!ACCEPTED_EXT.some((ext) => name.endsWith(ext))) return t.escucha.errorFormato;
    if (file.size > MAX_BYTES) return t.escucha.errorTamano;
    if (!file.size) return t.escucha.errorGenerico;
    return null;
  };

  const runStructure = async (tr: Transcript) => {
    setStatus('estructurando');
    try {
      const res = await fetch('/api/escucha-demo/structure', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ transcript: tr }),
      });
      if (res.status === 429) {
        setStatus('rate-limited');
        return;
      }
      if (!res.ok) {
        setStatus('transcrito-parcial');
        return;
      }
      const data = await res.json();
      setStructured(data.structured);
      setStatus('resultado');
    } catch {
      setStatus('transcrito-parcial');
    }
  };

  const handleFile = async (file: File) => {
    const clientError = validateClient(file);
    if (clientError) {
      setErrorMsg(clientError);
      setStatus('limite');
      return;
    }

    setObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    setErrorMsg(null);
    setStatus('transcribiendo');
    try {
      const form = new FormData();
      form.set('audio', file);
      const res = await fetch('/api/escucha-demo/transcribe', { method: 'POST', body: form });
      if (res.status === 429) {
        setStatus('rate-limited');
        return;
      }
      if (res.status === 400) {
        const data = await res.json().catch(() => null);
        setErrorMsg(data?.detalle === 'tamano' ? t.escucha.errorTamano : t.escucha.errorFormato);
        setStatus('limite');
        return;
      }
      if (!res.ok) {
        setStatus('saturado');
        return;
      }
      const data = await res.json();
      setTranscript(data.transcript);
      await runStructure(data.transcript);
    } catch {
      setStatus('saturado');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // Muestra opcional para quien no tiene un audio a mano: un discurso de 1943 en dominio
  // público (Wikimedia Commons, sin restricción de uso) — se procesa por el MISMO pipeline
  // real que un audio propio, nada queda fabricado a mano.
  const [loadingSample, setLoadingSample] = useState(false);
  const handleSample = async () => {
    setLoadingSample(true);
    try {
      const res = await fetch('/audio/muestra.ogg');
      if (!res.ok) {
        setStatus('saturado');
        return;
      }
      const blob = await res.blob();
      await handleFile(new File([blob], 'muestra.ogg', { type: 'audio/ogg' }));
    } catch {
      setStatus('saturado');
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {status === 'idle' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center gap-3 rounded-(--radius-m) border border-dashed p-8 text-center transition-colors ${
            dragOver ? 'border-pixel bg-pixel/5' : 'border-line'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
          <p className="font-display text-base font-semibold text-ink">{t.escucha.dropzoneTitle}</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="press rounded-(--radius-s) border border-line px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
          >
            {t.escucha.dropzoneCta}
          </button>
          <p className="font-mono text-xs text-dim">{t.escucha.dropzoneLimits}</p>
          <p className="text-xs text-dim">{t.escucha.dropzonePrivacidad}</p>
          <button
            type="button"
            onClick={handleSample}
            disabled={loadingSample}
            className="font-mono text-xs text-pixel-soft hover:underline disabled:opacity-60"
          >
            {loadingSample ? t.escucha.sampleLoading : t.escucha.sampleCta}
          </button>
          <p className="max-w-sm text-[0.7rem] text-dim">{t.escucha.sampleAttribution}</p>
        </div>
      )}

      {(status === 'transcribiendo' || status === 'estructurando') && (
        <ol className="flex flex-col gap-2 md:flex-row md:gap-3">
          {[
            { label: t.escucha.stageTranscribir, desc: t.escucha.stageTranscribirDesc, active: status === 'transcribiendo', done: status === 'estructurando' },
            { label: t.escucha.stageEstructurar, desc: t.escucha.stageEstructurarDesc, active: status === 'estructurando', done: false },
          ].map((s, i) => (
            <li
              key={i}
              className={`flex-1 rounded-(--radius-s) border p-3 transition-colors ${
                s.active ? 'border-pixel bg-pixel/10' : s.done ? 'border-pixel/40' : 'border-line'
              }`}
            >
              <p className={`font-mono text-xs [font-variant-numeric:tabular-nums] ${s.active || s.done ? 'text-pixel-soft' : 'text-dim'}`}>
                {String(i + 1).padStart(2, '0')} {s.label}
              </p>
              <p className="mt-1 text-xs text-dim">{s.desc}</p>
            </li>
          ))}
        </ol>
      )}

      {status === 'resultado' && structured && (
        <>
          <audio ref={audioRef} src={objectUrl ?? undefined} controls className="w-full" />
          <EscuchaResultView
            structured={structured}
            onCiteClick={(s) => {
              if (audioRef.current) audioRef.current.currentTime = s;
            }}
          />
          <button type="button" onClick={reset} className="w-fit font-mono text-sm text-pixel-soft hover:underline">
            {t.escucha.probarOtro}
          </button>
        </>
      )}

      {status === 'transcrito-parcial' && transcript && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-err">{t.escucha.errorEstructuracion}</p>
          <p className="rounded-(--radius-m) border border-line bg-surface-2 p-4 text-sm leading-relaxed text-ink/80">
            {transcript.text}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => runStructure(transcript)}
              className="press w-fit rounded-(--radius-s) border border-line px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
            >
              {t.escucha.reintentar}
            </button>
            <button type="button" onClick={reset} className="font-mono text-xs text-dim hover:text-pixel-soft hover:underline">
              {t.escucha.probarOtro}
            </button>
          </div>
        </div>
      )}

      {status === 'limite' && (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" className="text-sm text-err">
            {errorMsg}
          </p>
          <button type="button" onClick={reset} className="font-mono text-sm text-pixel-soft hover:underline">
            {t.escucha.reintentar}
          </button>
        </div>
      )}

      {status === 'rate-limited' && (
        <p role="alert" className="text-sm text-err">
          {t.escucha.errorRate}
        </p>
      )}

      {status === 'saturado' && (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" className="text-sm text-err">
            {t.escucha.errorSaturado}
          </p>
          <button type="button" onClick={onFallbackToCurated} className="font-mono text-sm text-pixel-soft hover:underline">
            {t.escucha.errorSaturadoCta}
          </button>
        </div>
      )}
    </div>
  );
}
