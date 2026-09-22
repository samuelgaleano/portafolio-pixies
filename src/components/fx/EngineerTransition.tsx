'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

// Transición global al ingeniero (Samuel r5 2026-07-18): CUALQUIER enlace a /samuel dispara
// el barrido (header, footer, teaser, portal del hero) — no solo el botón del hero. Delega
// los clics en document EN FASE DE CAPTURA para adelantarse a la navegación de next/link, y
// reproduce el wipe (cubre → navega → destapa → resetea). reduced-motion: navegación directa.
export default function EngineerTransition() {
  const overlay = useRef<HTMLSpanElement>(null);
  const leaving = useRef(false);
  const router = useRouter();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const go = () => {
    if (leaving.current) return;
    leaving.current = true;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !overlay.current) {
      router.push('/samuel');
      leaving.current = false;
      return;
    }
    // 2026-09-22: el barrido era una timeline de GSAP; ahora son dos animaciones CSS
    // encadenadas por `animationend` (cubre → navega → destapa). Quitar GSAP de aquí lo
    // saca del bundle de TODAS las rutas: este componente vive en el layout.
    const capa = overlay.current;
    capa.style.pointerEvents = 'auto';
    capa.classList.remove('is-out');
    capa.classList.add('is-in');
    const alCubrir = () => {
      capa.removeEventListener('animationend', alCubrir);
      router.push('/samuel');
      capa.classList.remove('is-in');
      capa.classList.add('is-out');
      const alDestapar = () => {
        capa.removeEventListener('animationend', alDestapar);
        capa.classList.remove('is-out');
        capa.style.pointerEvents = 'none';
        leaving.current = false;
      };
      capa.addEventListener('animationend', alDestapar);
    };
    capa.addEventListener('animationend', alCubrir);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href="/samuel"]');
      if (!a) return;
      e.preventDefault();
      e.stopPropagation();
      go();
    };
    // captura: se adelanta al onClick de next/link (que corre en la raíz de React)
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;
  return createPortal(<span ref={overlay} className="sig-transition" aria-hidden="true" />, document.body);
}
