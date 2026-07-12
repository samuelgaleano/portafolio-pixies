import type { Project } from '@/data/projects';
import { tech } from '@/data/tech';
import { t } from '@/i18n';

export default function ProjectCard({ project }: { project: Project }) {
  const href = project.status === 'produccion' ? project.liveUrl : project.repoUrl;
  const hasLink = Boolean(href);
  const badges = project.stack.map((id) => tech[id]);

  const inner = (
    <>
      {/* Preview: firma pixelada (§ DESIGN.md signature #3). Sin screenshot real → placeholder honesto. */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface-2">
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
          <span className="absolute bottom-2 left-2 font-mono text-[0.65rem] text-dim">
            {t.portfolio.missingShot}
          </span>
        )}
        <span
          className={`absolute right-2 top-2 rounded-(--radius-s) px-2 py-1 font-mono text-[0.65rem] font-medium ${
            project.status === 'produccion' ? 'bg-void/80 text-ok' : 'bg-void/80 text-data'
          }`}
        >
          {project.status === 'produccion' ? t.portfolio.statusLive : t.portfolio.statusCode}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h4 className="font-display text-lg font-semibold text-ink">{project.name}</h4>
          <p className="mt-1 text-sm text-dim">{project.tagline}</p>
        </div>

        <ul className="flex flex-col gap-1.5 font-mono text-xs text-dim">
          {project.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-pixel" aria-hidden="true">
                ▸
              </span>
              <span>{b}</span>
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

        {hasLink ? (
          <span className="font-mono text-xs text-pixel-soft opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:opacity-100">
            {project.status === 'produccion' ? t.portfolio.openLive : t.portfolio.openRepo}
          </span>
        ) : (
          <span className="font-mono text-xs text-dim">{t.portfolio.missingLink}</span>
        )}
      </div>
    </>
  );

  const cls =
    'group flex flex-col overflow-hidden rounded-(--radius-m) border border-line bg-surface transition-colors hover:border-pixel/60 focus-visible:border-pixel';

  return hasLink ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={project.name} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
