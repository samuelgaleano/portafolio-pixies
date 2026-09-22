'use client';

import { useEffect, useRef } from 'react';

// Barra de progreso de lectura: una franja violeta con remate de píxel que sigue el scroll
// de la página.
//
// 2026-09-22 (Samuel: "la página a veces se traba, bajos FPS"): antes esto usaba GSAP +
// ScrollTrigger, y como vive en el layout **arrastraba GSAP al bundle de TODAS las rutas**
// para mover una barra de 3 px. Ahora es vanilla: un listener de scroll pasivo que solo
// apunta el valor y un rAF que escribe una única variable CSS (`--sp`). Sin dependencias,
// sin layout thrashing (se lee scrollY, no el DOM) y el pintado lo hace el compositor.
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let raf = 0;
    let alto = Math.max(1, document.documentElement.scrollHeight - innerHeight);

    const pintar = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, scrollY / alto));
      el.style.setProperty('--sp', String(p));
    };
    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(pintar);
    };
    const medir = () => {
      alto = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      pedir();
    };

    medir();
    addEventListener('scroll', pedir, { passive: true });
    addEventListener('resize', medir, { passive: true });
    // el alto del documento cambia al abrir desplegables o al cargar imágenes
    const ro = new ResizeObserver(medir);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', pedir);
      removeEventListener('resize', medir);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={bar} className="scroll-progress__bar" />
    </div>
  );
}
