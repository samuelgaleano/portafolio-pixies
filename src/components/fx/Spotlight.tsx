'use client';

import { useRef } from 'react';

// Spotlight que sigue al cursor (Samuel r6 2026-07-18): un halo violeta radial se mueve con
// el puntero dentro del elemento — "visualización de cursor movible". Actualiza --mx/--my y
// el CSS pinta el radial. Reenvía props (p. ej. data-stagger) al div raíz.
export default function Spotlight({
  className = '',
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div ref={ref} onPointerMove={onPointerMove} className={`spotlight ${className}`} {...rest}>
      {children}
    </div>
  );
}
