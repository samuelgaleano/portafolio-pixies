'use client';

import { useEffect } from 'react';
import { categories } from '@/data/categories';
import { t } from '@/i18n';

// Scroll-spy: resalta el chip de la categoría visible. ponytail: IntersectionObserver, sin librería.
export default function CategoryNav() {
  useEffect(() => {
    const chips = document.querySelectorAll<HTMLAnchorElement>('.cat-chip');
    const active = (id: string) =>
      chips.forEach((c) => {
        const on = c.dataset.cat === id;
        c.classList.toggle('is-active', on);
        if (on) c.setAttribute('aria-current', 'true');
        else c.removeAttribute('aria-current');
      });
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) active(vis.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    chips.forEach((c) => {
      const sec = document.getElementById(c.dataset.cat!);
      if (sec) io.observe(sec);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label={t.portfolio.navLabel}
      className="sticky top-14 z-30 -mx-4 mb-12 overflow-x-auto border-y border-line/60 bg-void/80 px-4 backdrop-blur-md sm:-mx-6 sm:px-6"
    >
      <ul className="flex gap-2 py-3">
        {categories.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              data-cat={c.id}
              className="cat-chip whitespace-nowrap rounded-(--radius-s) border border-line px-3 py-1.5 font-mono text-xs text-dim transition-colors hover:border-pixel/60 hover:text-ink"
            >
              {c.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
