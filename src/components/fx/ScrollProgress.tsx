'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Barra de progreso de lectura (GSAP ScrollTrigger, patrón oficial gsap-skills):
// una franja violeta con remate de píxel que se desliza (xPercent, no scale — el remate
// no se deforma) siguiendo el scroll de toda la página. scrub: true = mapeo directo a la
// posición de scroll (solo se mueve cuando el usuario se desplaza, seguro también con
// reduced-motion). end: 'max' se recalcula solo en cada ScrollTrigger.refresh().
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // x: 0 en el "from": el CSS trae translateX(-101%) para que el HTML estático no
    // muestre la barra; GSAP lo leería como offset en px y lo SUMARÍA a xPercent
    // (doble desplazamiento). Al fijar x:0 aquí, xPercent queda como única fuente.
    gsap.fromTo(
      bar.current,
      { x: 0, xPercent: -101 },
      {
        xPercent: 0,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      }
    );
  });

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={bar} className="scroll-progress__bar" />
    </div>
  );
}
