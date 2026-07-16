'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

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
    gsap
      .timeline()
      .set(overlay.current, { pointerEvents: 'auto', x: 0, xPercent: -103 })
      // cubre la pantalla de izquierda a derecha, luego navega
      .to(overlay.current, {
        xPercent: 0,
        duration: 0.45,
        ease: 'power3.inOut',
        onComplete: () => router.push('/samuel'),
      })
      // destapa hacia la derecha (deja ver la página nueva) y resetea para el próximo uso
      .to(overlay.current, { xPercent: 103, duration: 0.45, ease: 'power3.inOut', delay: 0.08 })
      .set(overlay.current, {
        xPercent: -103,
        pointerEvents: 'none',
        onComplete: () => {
          leaving.current = false;
        },
      });
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
