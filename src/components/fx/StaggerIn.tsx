'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Entrada en cascada de los hijos marcados con [data-stagger] al entrar en viewport.
// Patrón oficial gsap-skills: useGSAP con scope (los selectores no salen del componente)
// + gsap.matchMedia() con condiciones — con reduced-motion no se anima nada (el contenido
// queda visible tal cual), y en móvil la distancia/cadencia son menores (responsivo).
// once: el ScrollTrigger se mata tras disparar; sin JS los ítems simplemente se ven.
export default function StaggerIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          isMobile: '(max-width: 767px)',
          isDesktop: '(min-width: 768px)',
        },
        (context) => {
          const { reduce, isMobile } = context.conditions as { reduce: boolean; isMobile: boolean };
          if (reduce) return; // sin animación: los ítems quedan visibles
          gsap.from('[data-stagger]', {
            opacity: 0,
            y: isMobile ? 16 : 26,
            duration: 0.7,
            ease: 'power2.out',
            stagger: isMobile ? 0.06 : 0.1,
            scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
          });
        }
      );
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
