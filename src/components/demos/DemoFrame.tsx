'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useOriginAwake } from './useOriginAwake';

// Marco tipo "pantalla" para las demos embebidas + estado de carga branded.
// Las demos corren en Render (plan free) y "duermen": la primera visita puede tardar
// bastante en despertar. Hasta confirmar que cargó de verdad se muestra un skeleton con
// shimmer para que nunca se vea un iframe en blanco.
//
// Dos caminos según el origen del iframe (root cause de "las demos no funcionan",
// 2026-09-09): POS y ERP van proxeados SAME-ORIGIN (rewrite en next.config), así que
// contentDocument.readyState es una señal fiable. La TV es un iframe DIRECTO
// cross-origin — ahí 'load' dispara igual aunque la conexión falle (páginas de error
// también "cargan"), así que antes de montar su src de verdad se sonda el origen
// (useOriginAwake) hasta confirmar que responde.
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
  const frameRef = useRef<HTMLIFrameElement>(null);

  // src relativo (empieza con "/") = proxeado same-origin (POS, ERP). src ABSOLUTO
  // ("http://…") = cross-origin directo (la TV) — la única distinción que importa, y
  // se puede resolver solo con el string, sin `window`. Ojo: mirar
  // `window.location.origin` aquí rompía el fix — en el render de SERVIDOR `window` no
  // existe, así que ese chequeo daba SIEMPRE "same-origin" y el HTML llegaba al
  // navegador con el src cross-origin ya puesto, la misma carrera que se quería evitar.
  const crossOriginRoot = useMemo(() => {
    if (!/^https?:\/\//.test(src)) return null;
    try {
      return new URL(src).origin;
    } catch {
      return null;
    }
  }, [src]);

  const originAwake = useOriginAwake(crossOriginRoot);
  const mountSrc = crossOriginRoot ? originAwake : true;

  // Camino same-origin: el iframe viaja en el HTML del servidor y puede terminar de
  // cargar ANTES de que React hidrate. Por eso, al montar, se mira el estado REAL del
  // iframe (readyState) en vez de esperar solo un evento 'load' que quizá ya ocurrió.
  useEffect(() => {
    if (crossOriginRoot) return;
    const el = frameRef.current;
    if (!el) return;

    const done = () => setLoaded(true);
    el.addEventListener('load', done);
    try {
      if (el.contentDocument?.readyState === 'complete') done();
    } catch {
      // no debería pasar en same-origin, pero por si acaso
    }
    const safety = window.setTimeout(done, 60000);

    return () => {
      el.removeEventListener('load', done);
      window.clearTimeout(safety);
    };
  }, [crossOriginRoot]);

  // Camino cross-origin: una vez useOriginAwake confirma que el origen responde, se
  // monta el src real. A esa altura el servidor YA contestó, así que 'load' aquí sí es
  // una señal razonable (y hay un margen corto de respaldo por si no llega).
  useEffect(() => {
    if (!crossOriginRoot || !originAwake) return;
    const el = frameRef.current;
    if (!el) return;

    const done = () => setLoaded(true);
    el.addEventListener('load', done);
    const safety = window.setTimeout(done, 15000);

    return () => {
      el.removeEventListener('load', done);
      window.clearTimeout(safety);
    };
  }, [crossOriginRoot, originAwake]);

  const waking = crossOriginRoot ? !originAwake : false;

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
        <div className={loaded && !waking ? 'demo-skeleton is-hidden' : 'demo-skeleton'} aria-hidden={loaded && !waking}>
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
          ref={frameRef}
          title={title}
          src={mountSrc ? src : undefined}
          className="relative z-[1] h-[82vh] w-full border-0"
          sandbox={sandbox}
        />
      </div>
    </div>
  );
}
