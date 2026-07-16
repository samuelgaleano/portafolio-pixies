'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Deriva sutil ligada al scroll (parallax) — patrón oficial gsap-skills:
// ScrollTrigger con scrub + gsap.matchMedia() para que con prefers-reduced-motion
// NO haya deriva (el contenido queda estático, nunca oculto). start/end con clamp()
// (v3.12+) para que en elementos al inicio/final de la página el rango no se salga
// del scroll real. Envuelve capas decorativas (atmósfera, wordmark del footer).
export default function Parallax({
  children,
  speed = 12,
  className,
}: {
  children: React.ReactNode;
  /** distancia de deriva en yPercent (de +speed a -speed a lo largo del viewport) */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          ref.current,
          { yPercent: speed },
          {
            yPercent: -speed,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'clamp(top bottom)',
              end: 'clamp(bottom top)',
              scrub: true,
            },
          }
        );
      });
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
