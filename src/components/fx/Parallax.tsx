'use client';

import { useEffect, useRef } from 'react';

// Deriva sutil ligada al scroll (parallax) de capas decorativas: atmósfera del hero,
// wordmark del footer. Con `prefers-reduced-motion` no hay deriva (el contenido queda
// estático, nunca oculto).
//
// 2026-09-22 (Samuel: "optimizar, la página se siente pesada"): antes usaba GSAP +
// ScrollTrigger y, al vivir en los tres heros y en el footer, metía GSAP en el bundle de
// todas las rutas. Ahora es vanilla y **compartido**: un solo listener de scroll y un solo
// rAF para TODAS las instancias de la página (registro a nivel de módulo), que escriben una
// variable CSS por elemento. El transform lo aplica el CSS (`.parallax`), así el trabajo
// por frame es una escritura de estilo por capa y nada más.

type Capa = { el: HTMLElement; speed: number };
const capas = new Set<Capa>();
let raf = 0;
let escuchando = false;

function pintar() {
  raf = 0;
  const vh = innerHeight;
  for (const { el, speed } of capas) {
    const r = el.getBoundingClientRect();
    // progreso de 0 (entrando por abajo) a 1 (saliendo por arriba)
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    el.style.setProperty('--par', `${(speed - 2 * speed * p).toFixed(2)}%`);
  }
}
function pedir() {
  if (!raf) raf = requestAnimationFrame(pintar);
}

function suscribir(capa: Capa) {
  capas.add(capa);
  if (!escuchando) {
    escuchando = true;
    addEventListener('scroll', pedir, { passive: true });
    addEventListener('resize', pedir, { passive: true });
  }
  pedir();
  return () => {
    capas.delete(capa);
    if (capas.size === 0 && escuchando) {
      escuchando = false;
      removeEventListener('scroll', pedir);
      removeEventListener('resize', pedir);
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

export default function Parallax({
  children,
  speed = 12,
  className,
}: {
  children: React.ReactNode;
  /** distancia de deriva en % (de +speed a -speed a lo largo del viewport) */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.classList.add('parallax');
    return suscribir({ el, speed });
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
