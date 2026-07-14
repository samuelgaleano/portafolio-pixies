'use client';

import { useEffect, useState } from 'react';
import { categories } from '@/data/categories';
import { t } from '@/i18n';

// Scroll-spy con estado React (className derivado, no manipulación imperativa del DOM).
// ponytail: IntersectionObserver nativo, sin librería.
export default function CategoryNav() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActiveId(vis.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    categories.forEach((c) => {
      const sec = document.getElementById(c.id);
      if (sec) io.observe(sec);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label={t.portfolio.navLabel}
      className="nav-scroll-fade sticky top-14 z-30 -mx-4 mb-12 overflow-x-auto border-y border-line/60 bg-void/80 px-4 backdrop-blur-md sm:-mx-6 sm:px-6"
    >
      <ul className="flex gap-2 py-3">
        {categories.map((c) => {
          const on = activeId === c.id;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={on ? 'true' : undefined}
                className={`cat-chip flex min-h-11 items-center whitespace-nowrap rounded-(--radius-s) border px-3 font-mono text-xs transition-colors sm:min-h-9 ${
                  on ? 'is-active border-pixel text-ink' : 'border-line text-dim hover:border-pixel/60 hover:text-ink'
                }`}
              >
                {c.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
