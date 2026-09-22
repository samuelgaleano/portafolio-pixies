'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Reproduce UNA vez el morph letra→ícono de los glifos no fijos cuando su anfitrión entra en
// vista (mockup 15-final-ajustado.html, "teaserFirma"): así el gesto se ve también sin mouse
// (móvil) y sin depender de que alguien pase el cursor. Solo añade/quita `.is-teasing`
// en `[data-glyph-host]`; la animación es la misma del hover (globals.css). reduced-motion
// lo apaga. Se re-arma al navegar (App Router).
export default function GlyphTeaser() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hosts = Array.from(document.querySelectorAll<HTMLElement>('[data-glyph-host]:not(:has(.is-fijo))'));
    if (!hosts.length) return;

    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          const idx = hosts.indexOf(el);
          timers.push(
            window.setTimeout(() => {
              el.classList.add('is-teasing');
              timers.push(window.setTimeout(() => el.classList.remove('is-teasing'), 1400));
            }, 700 + idx * 180),
          );
        });
      },
      { threshold: 0.6 },
    );
    hosts.forEach((h) => io.observe(h));
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      hosts.forEach((h) => h.classList.remove('is-teasing'));
    };
  }, [pathname]);

  return null;
}
