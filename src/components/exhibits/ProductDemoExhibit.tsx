'use client';

import { useState } from 'react';
import { escuchaProduct } from '@/data/escucha-comprendiendo';
import { t } from '@/i18n';
import EscuchaCuratedTour from './EscuchaCuratedTour';
import EscuchaLiveDemo from './EscuchaLiveDemo';
import EscuchaAccessForm from './EscuchaAccessForm';

// Exhibit de "Productos propios" (§ plan): dos pestañas — un ejemplo real ya procesado
// (siempre funciona, sin red) y una demo en vivo real pero limitada. Si el ejemplo curado
// todavía no está listo, arranca directo en la pestaña en vivo para no mostrar nunca un
// placeholder como si fuera contenido real.
export default function ProductDemoExhibit() {
  const [tab, setTab] = useState<'curada' | 'vivo'>(escuchaProduct.example.ready ? 'curada' : 'vivo');

  return (
    <div className="mt-6">
      <div className="rounded-(--radius-m) border border-line bg-surface/60 p-5 sm:p-6">
        <p className="font-mono text-xs text-pixel-soft">{escuchaProduct.eyebrow}</p>
        <h3 className="mt-2 font-display text-xl font-semibold text-ink">{escuchaProduct.tagline}</h3>
        <p className="mt-2 max-w-2xl text-sm text-dim">{escuchaProduct.descripcion}</p>
      </div>

      <div role="tablist" className="mt-6 flex gap-2">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'curada'}
          onClick={() => setTab('curada')}
          className={`rounded-(--radius-s) border px-4 py-2 font-mono text-xs transition-colors ${
            tab === 'curada' ? 'border-pixel bg-pixel/10 text-pixel-soft' : 'border-line text-dim hover:text-ink'
          }`}
        >
          {t.escucha.tabCurada}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'vivo'}
          onClick={() => setTab('vivo')}
          className={`rounded-(--radius-s) border px-4 py-2 font-mono text-xs transition-colors ${
            tab === 'vivo' ? 'border-pixel bg-pixel/10 text-pixel-soft' : 'border-line text-dim hover:text-ink'
          }`}
        >
          {t.escucha.tabVivo}
        </button>
      </div>

      <div className="mt-5 rounded-(--radius-m) border border-line bg-surface p-5 md:p-6">
        {tab === 'curada' ? (
          <EscuchaCuratedTour onTryLive={() => setTab('vivo')} />
        ) : (
          <EscuchaLiveDemo onFallbackToCurated={() => setTab('curada')} />
        )}
      </div>

      <EscuchaAccessForm />
    </div>
  );
}
