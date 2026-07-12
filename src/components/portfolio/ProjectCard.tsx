import type { Project } from '@/data/projects';
import { tech } from '@/data/tech';
import { t } from '@/i18n';
import Pending from '@/components/ui/Pending';

// variant 'wide': tarjeta case-study horizontal para categorías con 1 solo proyecto
// (un grid de 3 con 1 tarjeta lee como layout sin terminar — critique P2).
export default function ProjectCard({ project, variant = 'default' }: { project: Project; variant?: 'default' | 'wide' }) {
  const href = project.status === 'produccion' ? project.liveUrl : project.repoUrl;
  const hasLink = Boolean(href);
  const badges = project.stack.map((id) => tech[id]);
  const wide = variant === 'wide';

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
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="pixel-mask absolute inset-0" aria-hidden="true" />
      )}
      {!project.preview.src && (
        <span className="absolute bottom-2 left-2">
          <Pending>{t.portfolio.pendingShot}</Pending>
        </span>
      )}
      <span
        className={`absolute right-2 top-2 rounded-(--radius-s) px-2 py-1 font-mono text-xs font-medium ${
          project.status === 'produccion' ? 'bg-void/80 text-ok' : 'bg-void/80 text-data'
        }`}
      >
        {project.status === 'produccion' ? t.portfolio.statusLive : t.portfolio.statusCode}
      </span>
    </div>
  );

  const body = (
    <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
      <div>
        <h4 className={`font-display font-semibold text-ink ${wide ? 'text-xl md:text-2xl' : 'text-lg'}`}>
          {project.name}
        </h4>
        <p className="mt-1 text-sm text-dim">{project.tagline}</p>
      </div>

      {/* key por índice: el texto crudo del bullet no debe viajar en el payload RSC */}
      <ul className="flex flex-col gap-1.5 font-mono text-xs text-dim">
        {project.bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-pixel" aria-hidden="true">
              ▸
            </span>
            {b.startsWith('[') ? <Pending>{t.exhibit.pendingTech}</Pending> : <span>{b}</span>}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
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

      {/* siempre visible: no esconder lo esencial tras el hover (critique P2) */}
      {hasLink ? (
        <span className="font-mono text-xs text-dim transition-colors group-hover:text-pixel-soft">
          {project.status === 'produccion' ? t.portfolio.openLive : t.portfolio.openRepo}
        </span>
      ) : (
        <Pending>{t.portfolio.pendingLink}</Pending>
      )}
    </div>
  );

  const cls = `group overflow-hidden rounded-(--radius-m) border border-line bg-surface transition-colors hover:border-pixel/60 focus-visible:border-pixel ${
    wide ? 'grid md:grid-cols-[1.1fr_1fr]' : 'flex flex-col'
  }`;

  return hasLink ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={project.name} className={cls}>
      {preview}
      {body}
    </a>
  ) : (
    <div className={cls}>
      {preview}
      {body}
    </div>
  );
}
