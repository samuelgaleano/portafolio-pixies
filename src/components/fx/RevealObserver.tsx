'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Scroll-reveals (plan F6 V2): las secciones con [data-reveal] entran con fade-up al
// aparecer. Mejora progresiva: la clase `js-reveal` en <html> es lo ÚNICO que oculta
// los elementos, así que sin JS todo se ve. Se re-ejecuta al navegar (App Router).
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('js-reveal');
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)');

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
