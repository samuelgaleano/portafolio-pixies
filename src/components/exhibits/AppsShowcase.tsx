import Link from 'next/link';
import type { ReactElement } from 'react';
import { apps, appPath, type AppIconId } from '@/data/apps';
import { t } from '@/i18n';

// Sección "Aplicaciones by Pixies" en la home (§ pedido de Samuel): una tarjeta VISUAL por app
// que diga qué es y qué hace de un vistazo, y nada más — el demo completo, el ejemplo y la
// descarga viven en la página propia de cada app. Tarjeta entera clicable (stretched link,
// mismo patrón que ProjectCard).

// Un glifo por app, elegido por `app.icon` — así una segunda app no hereda el de la primera.
const ICONS: Record<AppIconId, () => ReactElement> = {
  // audio → contexto: barras de onda a la izquierda, líneas de lista con check a la derecha
  'audio-a-lista': () => (
    <svg viewBox="0 0 96 96" className="size-full" aria-hidden="true">
      <rect width="96" height="96" rx="20" fill="var(--color-pixel)" />
      <g fill="var(--color-void)" opacity="0.92">
        <rect x="14" y="40" width="5" height="16" rx="2.5" />
        <rect x="22" y="32" width="5" height="32" rx="2.5" />
        <rect x="30" y="24" width="5" height="48" rx="2.5" />
        <rect x="38" y="36" width="5" height="24" rx="2.5" />
      </g>
      <path d="M50 48h8" stroke="var(--color-void)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <g fill="none" stroke="var(--color-void)" strokeWidth="3.5" strokeLinecap="round">
        <path d="M64 36h18" />
        <path d="M64 48h18" />
        <path d="M64 60h11" />
      </g>
      <path d="M78 56l3 3 6-7" fill="none" stroke="var(--color-void)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function AppsShowcase() {
  return (
    <div className="mt-6 grid gap-6">
      {apps.map((app) => {
        const Icon = ICONS[app.icon];
        return (
          <article
            key={app.slug}
            className="proj-card group relative overflow-hidden rounded-(--radius-m) border border-line bg-surface focus-within:border-pixel"
          >
            <span className="proj-sheen" aria-hidden="true" />
            <div className="relative grid gap-6 p-5 sm:p-6 md:grid-cols-[auto_1fr] md:items-center md:gap-8 md:p-8">
              <div className="size-24 shrink-0 transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-105 md:size-32">
                <Icon />
              </div>

              <div className="min-w-0">
                {/* el encabezado es el NOMBRE (como en ProjectCard); el hook es copy, no outline */}
                <h4 className="font-mono text-xs font-normal text-pixel-soft">{app.nombre}</h4>
                <p className="mt-2 font-display text-xl font-semibold text-ink md:text-2xl">{app.hook}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-dim">{app.descripcion}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {app.capacidades.map((c) => (
                    <span key={c} className="rounded-(--radius-s) border border-line px-2 py-1 font-mono text-xs text-dim">
                      {c}
                    </span>
                  ))}
                </div>

                <span className="mt-5 inline-flex items-center rounded-(--radius-s) bg-pixel px-4 py-2.5 font-mono text-xs font-medium text-void transition group-hover:brightness-110">
                  {t.escucha.appEnter}
                </span>
              </div>
            </div>

            <Link
              href={appPath(app.slug)}
              aria-label={`${app.nombre} — ${t.escucha.appEnterAria}`}
              className="absolute inset-0 z-0"
            />
          </article>
        );
      })}
    </div>
  );
}
