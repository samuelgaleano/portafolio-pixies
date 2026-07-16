'use client';

import { useState } from 'react';

// Marco tipo "pantalla" para las demos embebidas + estado de carga branded.
// Las demos corren en Render (plan free) y "duermen": la primera visita tarda ~30 s en
// despertar. Hasta que el iframe dispara onLoad se muestra un skeleton con shimmer para
// que nunca se vea un iframe en blanco. El marco (barra + píxeles + "url") da contexto y
// hace que la demo luzca como una app dentro de una pantalla.
//
// sandbox: se mantiene el mismo que ya usaban las páginas (allow-same-origin es seguro
// porque son NUESTRAS demos, proxeadas same-origin salvo el TV).
export default function DemoFrame({
  src,
  title,
  label,
  sandbox = 'allow-forms allow-scripts allow-same-origin allow-popups allow-modals',
}: {
  src: string;
  title: string;
  label: string;
  sandbox?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="demo-frame">
      <div className="demo-frame__bar">
        <span className="demo-frame__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="demo-frame__url">{label}</span>
      </div>
      <div className="demo-frame__screen">
        <div className={loaded ? 'demo-skeleton is-hidden' : 'demo-skeleton'} aria-hidden={loaded}>
          <span className="demo-skeleton__grid" />
          <span className="demo-skeleton__sheen" />
          <span className="demo-skeleton__pixels" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <p className="relative font-mono text-sm text-ink">Despertando la demo…</p>
          <p className="relative max-w-xs text-center font-mono text-xs text-dim">
            El servidor la reactiva; la primera vez puede tardar ~30&nbsp;s.
          </p>
        </div>
        <iframe
          title={title}
          src={src}
          onLoad={() => setLoaded(true)}
          className="relative z-[1] h-[82vh] w-full border-0"
          sandbox={sandbox}
        />
      </div>
    </div>
  );
}
