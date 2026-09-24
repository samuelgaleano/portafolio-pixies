'use client';

import { useState } from 'react';
import { escuchaProduct } from '@/data/escucha-comprendiendo';
import { t } from '@/i18n';
import EscuchaCuratedTour from './EscuchaCuratedTour';
import EscuchaLiveDemo from './EscuchaLiveDemo';
import EscuchaAccessForm from './EscuchaAccessForm';

// Experiencia completa de escuchacomprendiendo.IA — vive en su página propia
// (/aplicaciones/escuchacomprendiendo-ai), NO en la home (§ pedido de Samuel: la home solo
// muestra la tarjeta-teaser). Dos pestañas: un ejemplo real ya procesado (siempre funciona,
// sin red) y una demo en vivo real pero limitada. Si el ejemplo curado todavía no está listo,
// arranca directo en la pestaña en vivo para no mostrar nunca un placeholder como contenido real.
export default function ProductDemoExhibit() {
  const [tab, setTab] = useState<'curada' | 'vivo'>(escuchaProduct.example.ready ? 'curada' : 'vivo');

  return (
    <div className="mt-8">
      {/* Outline: h1 (nombre de la app) → h2 (este bloque) → h3 (áreas del resultado).
          Visualmente las pestañas ya lo dicen; el h2 es para lectores de pantalla y crawlers. */}
      <h2 className="sr-only">{t.escucha.demoHeading}</h2>
      {/* Sin ejemplo curado no hay nada que elegir: mostrar una pestaña "Ejemplo real" que
          lleva a "en preparación" promete contenido que no existe (Samuel, 2026-09-23: "de
          una vez llega como demo"). Cuando example.ready pase a true, las pestañas vuelven. */}
      <div role="tablist" className={`flex gap-2${escuchaProduct.example.ready ? '' : ' hidden'}`}>
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

      {/* La demo vive DENTRO de una ventana desde el primer segundo (Samuel, 2026-09-23: "que
          visualmente sea como la aplicación, para evitar que la gente se aburra"). Antes la
          caja era un panel neutro y la carcasa solo aparecía al terminar de procesar: se
          perdía la pista de que esto es una app de escritorio hasta el final. */}
      <div className="mt-5 app-marco">
        <div className="app-marco__barra">
          <span className="app-marco__semaforo" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="app-marco__titulo">{t.escucha.shellTitulo}</span>
          <span className="app-marco__etiqueta">{t.escucha.shellDemo}</span>
        </div>
        <div className="app-marco__lienzo">
          {tab === 'curada' ? (
            <EscuchaCuratedTour onTryLive={() => setTab('vivo')} />
          ) : (
            <EscuchaLiveDemo onFallbackToCurated={() => setTab('curada')} />
          )}
        </div>
      </div>

      <EscuchaAccessForm />
    </div>
  );
}
