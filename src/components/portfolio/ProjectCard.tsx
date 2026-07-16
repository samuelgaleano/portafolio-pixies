import type { Project } from '@/data/projects';
import { tech } from '@/data/tech';
import { t } from '@/i18n';
import Pending from '@/components/ui/Pending';
import Collapsible from '@/components/ui/Collapsible';

// variant 'wide': tarjeta case-study horizontal para categorías con 1 solo proyecto
// (un grid de 3 con 1 tarjeta lee como layout sin terminar).
// Rediseño (Samuel, 2026-07-18): vista SINTETIZADA por defecto (preview + nombre + tagline
// + iconos de stack) y el detalle técnico (bullets + stack con nombres) bajo un desplegable
// premium. La tarjeta sigue siendo clicable entera vía "stretched link" (un <a> absoluto);
// el toggle vive por encima (z-[1]) para desplegar sin navegar.
export default function ProjectCard({ project, variant = 'default' }: { project: Project; variant?: 'default' | 'wide' }) {
  // demo en vivo tiene prioridad como enlace primario (es lo que un cliente quiere ver);
  // si no, sitio en producción; si no, el repo.
  const href = project.demoUrl || (project.status === 'produccion' ? project.liveUrl : project.repoUrl);
  const hasLink = Boolean(href);
  const isDemo = Boolean(project.demoUrl);
  const badges = project.stack.map((id) => tech[id]);
  const wide = variant === 'wide';
  const bullets = project.bullets.filter((b) => !b.startsWith('['));
  const statusLabel = isDemo
    ? t.portfolio.statusDemo
    : project.status === 'produccion'
      ? t.portfolio.statusLive
      : t.portfolio.statusCode;
  const linkLabel = isDemo
    ? t.portfolio.openDemo
    : project.status === 'produccion'
      ? t.portfolio.openLive
      : t.portfolio.openRepo;

  const preview = (
    <div
      className={`relative overflow-hidden border-line bg-surface-2 ${
        wide ? 'aspect-[16/10] border-b md:aspect-auto md:border-b-0 md:border-r' : 'aspect-[16/10] border-b'
      }`}
    >
      {project.preview.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.preview.src}
          alt={project.preview.alt}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-105"
        />
      ) : (
        <div className="pixel-mask absolute inset-0" aria-hidden="true" />
      )}
      {!project.preview.src && (
        <span className="absolute bottom-2 left-2">
          <Pending>{t.portfolio.pendingShot}</Pending>
        </span>
      )}
      {/* reflejo que barre al hacer hover sobre la tarjeta (solo si hay preview real) */}
      {project.preview.src && <span className="proj-sheen" aria-hidden="true" />}
      <span
        className={`absolute right-2 top-2 rounded-(--radius-s) px-2 py-1 font-mono text-xs font-medium ${
          isDemo ? 'bg-void/80 text-pixel-soft' : project.status === 'produccion' ? 'bg-void/80 text-ok' : 'bg-void/80 text-data'
        }`}
      >
        {statusLabel}
      </span>
      {/* al pasar sobre la cuadrícula de un producto con demo: overlay "Ver demo en vivo" que
          sube — señala que es oprimible para ir al demo (Samuel r20) */}
      {isDemo && (
        <span className="proj-demo-hint" aria-hidden="true">
          <span className="proj-demo-hint__btn">▶ {t.portfolio.openDemo}</span>
        </span>
      )}
    </div>
  );

  // iconos de stack SIEMPRE visibles (hacen referencia); los nombres completos van en el desplegable
  const stackIcons = (
    <div className="flex flex-wrap items-center gap-1.5">
      {badges.map((tch) => (
        <span
          key={tch.id}
          title={tch.name}
          className="inline-flex size-6 items-center justify-center rounded-(--radius-s) border border-line bg-surface-2"
        >
          <svg viewBox="0 0 24 24" className="size-3.5 fill-data" aria-hidden="true">
            <path d={tch.d} />
          </svg>
          <span className="sr-only">{tch.name}</span>
        </span>
      ))}
    </div>
  );

  const body = (
    <div className="relative flex flex-1 flex-col gap-3 p-4 md:p-5">
      <div>
        <h4 className={`font-display font-semibold text-ink ${wide ? 'text-lg md:text-xl' : 'text-base'}`}>
          {project.name}
        </h4>
        <p className="mt-1 text-[0.82rem] leading-relaxed text-dim">{project.tagline}</p>
      </div>

      {stackIcons}

      {/* detalle técnico bajo demanda (síntesis premium): bullets + stack con nombres */}
      {bullets.length > 0 && (
        <Collapsible label={t.portfolio.detailsShow} labelOpen={t.portfolio.detailsHide}>
          <ul className="flex flex-col gap-1.5 pt-3 font-mono text-xs text-dim">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-pixel" aria-hidden="true">
                  ▸
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-line pt-3">
            <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-wide text-dim">{t.portfolio.stackLabel}</p>
            <div className="flex flex-wrap items-center gap-2">
              {badges.map((tch) => (
                <span
                  key={tch.id}
                  className="inline-flex items-center gap-1.5 rounded-(--radius-s) border border-line px-2 py-1 text-xs text-dim"
                >
                  <svg viewBox="0 0 24 24" className="size-3.5 fill-data" aria-hidden="true">
                    <path d={tch.d} />
                  </svg>
                  {tch.name}
                </span>
              ))}
            </div>
          </div>
        </Collapsible>
      )}

      {/* CTA minimalista (la tarjeta entera ya navega vía stretched link): solo una pista */}
      {hasLink ? (
        <span className="pointer-events-none relative z-[1] mt-auto inline-flex w-fit items-center gap-1 font-mono text-xs font-medium text-pixel-soft transition-transform [@media(hover:hover)]:group-hover:translate-x-0.5">
          {linkLabel}
        </span>
      ) : (
        <span className="relative z-[1] mt-auto">
          <Pending>{t.portfolio.pendingLink}</Pending>
        </span>
      )}
    </div>
  );

  const cls = `proj-card group relative overflow-hidden rounded-(--radius-m) border border-line bg-surface focus-within:border-pixel ${
    wide ? 'grid md:grid-cols-[1.1fr_1fr]' : 'flex flex-col'
  }`;

  return (
    <article className={cls}>
      {preview}
      {body}
      {/* stretched link: TODA la tarjeta —incluida la cuadrícula/preview— navega al demo/sitio/repo
          (Samuel r20). Va al final para pintar por encima; los controles del cuerpo van con z-[1]. */}
      {hasLink && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} — ${linkLabel.replace(' →', '')}`}
          className="absolute inset-0 z-0"
        />
      )}
    </article>
  );
}
