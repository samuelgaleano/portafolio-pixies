'use client';

import { useEffect, useRef } from 'react';

// Entrada en cascada de los hijos directos al entrar en viewport.
//
// 2026-09-22: antes GSAP + ScrollTrigger; ahora un IntersectionObserver que añade una clase
// y deja la animación al CSS (`.stagger-in > *`, con `--i` por hijo). Mismo efecto, sin
// arrastrar GSAP a /samuel. Mejora progresiva: sin JS o con `prefers-reduced-motion` los
// hijos se ven tal cual (la clase que los oculta la pone este componente, no el HTML).
export default function StaggerIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.classList.add('stagger-in');
    Array.from(el.children).forEach((hijo, i) => (hijo as HTMLElement).style.setProperty('--i', String(i)));

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.classList.add('is-in');
        io.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
