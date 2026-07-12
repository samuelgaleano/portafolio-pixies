import { t } from '@/i18n';
import { credentials, kindGroups } from '@/data/certifications';
import Pending from '@/components/ui/Pending';

// Mapa de conocimiento: nodos agrupados por tipo (§7.3), no lista plana.
// Solo credenciales con título real; los grupos vacíos muestran estado diseñado (critique P0).
export default function KnowledgeMap() {
  const groups = kindGroups.map((g) => ({
    ...g,
    items: credentials.filter((c) => c.kind === g.kind && !c.title.startsWith('[')),
  }));

  return (
    <section data-reveal className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
      <h2 className="font-display text-h2 font-semibold">{t.samuel.knowledgeTitle}</h2>
      <p className="mt-3 max-w-xl text-dim">{t.samuel.knowledgeIntro}</p>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {groups.map((g) => (
          <div key={g.kind}>
            <p className="mb-4 flex items-center gap-2 font-mono text-xs text-pixel-soft">
              <span className="inline-block size-2 bg-pixel" aria-hidden="true" />
              {g.label}
            </p>
            {g.items.length === 0 && <Pending>{t.common.credsPending}</Pending>}
            <ul className="flex flex-col gap-3">
              {g.items.map((c) => {
                const body = (
                  <>
                    <p className="font-medium text-ink">{c.title}</p>
                    <p className="mt-1 text-sm text-dim">
                      {c.institution.startsWith('[') ? <Pending>{t.common.toConfirm}</Pending> : c.institution}
                    </p>
                    <p className="mt-2 flex items-center justify-between font-mono text-xs text-dim">
                      <span>{c.year.startsWith('[') ? '· · ·' : c.year}</span>
                      {c.url && <span className="text-pixel-soft group-hover:underline">verificar →</span>}
                    </p>
                  </>
                );
                const cls =
                  'group block rounded-(--radius-m) border border-line bg-surface p-4 transition-colors hover:border-pixel/60';
                return (
                  <li key={c.title}>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className={cls}>
                        {body}
                      </a>
                    ) : (
                      <div className={cls}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
