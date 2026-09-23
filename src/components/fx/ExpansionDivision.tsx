'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

// Expansión de color al elegir división (Samuel, 2026-09-22: "si se oprime, que la animación
// sea que se expande el botón con el color de la sección escogida y ya llegamos a esa
// sección"). Se engancha a cualquier elemento con `data-expandir="creative|web"`: los dos
// cuadrados del hero y los dos capítulos de abajo.
//
// Cómo funciona: un círculo del color de la división nace EN el botón que se oprimió y crece
// hasta cubrir la pantalla; con la pantalla tapada se navega, y al destaparse ya estamos en
// la división. Vive sólo en la home, que es donde están esos cuatro elementos.
//
// Lección de b13e34b, aplicada aquí a propósito: aquel barrido encadenaba la navegación a un
// `animationend` que, al desaparecer el CSS, no se disparaba nunca — y el botón dejó de
// navegar sin que nada fallara a gritos. Aquí la animación la escribe este archivo (no puede
// "faltar"), y además `router.push` corre en un `Promise.race` con un plazo máximo: si la
// animación no termina por lo que sea, la navegación ocurre igual.
const COLORES = { creative: 'var(--color-marketing)', web: 'var(--color-pixel)' } as const;
const DESTINOS = { creative: '/marketing', web: '/web' } as const;
const DURACION = 520;

function plazo(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function ExpansionDivision() {
  const capa = useRef<HTMLSpanElement>(null);
  const saliendo = useRef(false);
  const router = useRouter();
  const montado = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as Element | null)?.closest?.('[data-expandir]') as HTMLElement | null;
      if (!el) return;
      const clave = el.dataset.expandir as keyof typeof DESTINOS | undefined;
      if (!clave || !DESTINOS[clave]) return;

      e.preventDefault();
      e.stopPropagation();
      if (saliendo.current) return;
      saliendo.current = true;

      const destino = DESTINOS[clave];
      const nodo = capa.current;
      if (!nodo || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        router.push(destino);
        saliendo.current = false;
        return;
      }

      // el círculo arranca del tamaño del botón, centrado en él, y crece hasta la esquina
      // más lejana de la ventana
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const final = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
      const inicio = Math.max(r.width, r.height) / 2;

      nodo.style.setProperty('--expansion-color', COLORES[clave]);
      document.documentElement.dataset.expandiendo = clave;

      const crecer = nodo.animate(
        [
          { clipPath: `circle(${inicio}px at ${cx}px ${cy}px)`, opacity: 1 },
          { clipPath: `circle(${final}px at ${cx}px ${cy}px)`, opacity: 1 },
        ],
        { duration: DURACION, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }
      );

      // plazo máximo: la navegación NUNCA queda colgada de que la animación termine
      Promise.race([crecer.finished.catch(() => {}), plazo(DURACION + 260)]).then(() => {
        router.push(destino);
        const destapar = nodo.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 300,
          delay: 120,
          easing: 'ease-out',
          fill: 'forwards',
        });
        Promise.race([destapar.finished.catch(() => {}), plazo(700)]).then(() => {
          crecer.cancel();
          destapar.cancel();
          delete document.documentElement.dataset.expandiendo;
          saliendo.current = false;
        });
      });
    };

    // captura: hay que adelantarse al onClick de next/link
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!montado) return null;
  return createPortal(<span ref={capa} className="expansion-div" aria-hidden="true" />, document.body);
}
