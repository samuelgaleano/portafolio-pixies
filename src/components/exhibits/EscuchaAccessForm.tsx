'use client';

import { useState } from 'react';
import { t } from '@/i18n';
import { buildWhatsAppUrl } from '@/lib/leads';
import { site } from '@/data/site';

type Status = 'idle' | 'loading' | 'error-codigo' | 'error-rate' | 'error-generico';

// Fase 2 (§ plan "productos propios"): descarga gateada del ejecutable real, con un único
// código de acceso compartido que Samuel entrega por WhatsApp/LinkedIn. El endpoint solo
// revela la URL real después de validar el código — acá no vive ningún secreto.
export default function EscuchaAccessForm() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [pending, setPending] = useState<'nsis' | 'portable' | null>(null);

  const submit = async (variant: 'nsis' | 'portable') => {
    if (!code.trim()) return;
    setPending(variant);
    setStatus('loading');
    try {
      const res = await fetch('/api/escucha-demo/download', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code, variant }),
      });
      if (res.status === 401) {
        setStatus('error-codigo');
        return;
      }
      if (res.status === 429) {
        setStatus('error-rate');
        return;
      }
      if (!res.ok) {
        setStatus('error-generico');
        return;
      }
      const data = await res.json();
      setStatus('idle');
      window.location.href = data.url;
    } catch {
      setStatus('error-generico');
    } finally {
      setPending(null);
    }
  };

  const waUrl = buildWhatsAppUrl(site.whatsapp, {
    nombre: 'Samuel',
    tipoProyecto: 'Producto propio (escuchacomprendiendo.ai)',
    mensaje: 'Vi la demo de escuchacomprendiendo.ai en el portafolio. ¿Me compartes el código de acceso para la app de escritorio?',
  });

  return (
    <div className="mt-6 rounded-(--radius-m) border border-line bg-surface/60 p-5 md:p-6">
      {/* h2: es una sección hermana del bloque de prueba dentro de la página de la app (h1) */}
      <h2 className="font-display text-base font-semibold text-ink">{t.escucha.accessTitle}</h2>
      <p className="mt-1 max-w-lg text-sm text-dim">{t.escucha.accessBody}</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (status !== 'idle' && status !== 'loading') setStatus('idle');
          }}
          placeholder={t.escucha.accessPlaceholder}
          className="rounded-(--radius-s) border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-pixel"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => submit('nsis')}
            disabled={!code.trim() || status === 'loading'}
            className="press rounded-(--radius-s) bg-pixel px-4 py-2 font-mono text-xs font-medium text-void transition hover:brightness-110 disabled:opacity-50"
          >
            {status === 'loading' && pending === 'nsis' ? t.escucha.accessDownloading : t.escucha.accessSubmitNsis}
          </button>
          <button
            type="button"
            onClick={() => submit('portable')}
            disabled={!code.trim() || status === 'loading'}
            className="press rounded-(--radius-s) border border-line px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-pixel hover:text-pixel-soft disabled:opacity-50"
          >
            {status === 'loading' && pending === 'portable' ? t.escucha.accessDownloading : t.escucha.accessSubmitPortable}
          </button>
        </div>
      </div>

      {status === 'error-codigo' && (
        <p role="alert" className="mt-3 text-sm text-err">
          {t.escucha.accessErrorCodigo}
        </p>
      )}
      {status === 'error-rate' && (
        <p role="alert" className="mt-3 text-sm text-err">
          {t.escucha.accessErrorRate}
        </p>
      )}
      {status === 'error-generico' && (
        <p role="alert" className="mt-3 text-sm text-err">
          {t.escucha.accessErrorGenerico}
        </p>
      )}

      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-mono text-xs text-pixel-soft hover:underline">
        {t.escucha.accessSolicitar}
      </a>
    </div>
  );
}
