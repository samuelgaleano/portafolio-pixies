import { t } from '@/i18n';

// Cinco servicios (SECCION-MARKETING.md §2 + servicios/*.md): cada cubo dice canal y
// entregable, nada de humo. Mismo patrón de cabecera que PortfolioSection/Statement.
export default function Servicios() {
  const { servicios } = t.marketing;
  return (
    <section id="servicios" className="mx-auto w-full max-w-[1200px] scroll-mt-16 px-4 py-20 sm:px-6">
      <header data-reveal="wipe" className="mb-10">
        <p className="font-mono text-sm text-[color:var(--color-marketing-texto)]">{servicios.eyebrow}</p>
        <h2 className="mt-2 font-display text-h2 font-semibold">{servicios.title}</h2>
        <p className="mt-3 max-w-xl text-dim">{servicios.intro}</p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {servicios.items.map((s, i) => (
          <article
            key={s.title}
            data-reveal={i % 2 === 0 ? 'left' : 'right'}
            className="flex flex-col gap-3 rounded-(--radius-m) border border-line bg-surface p-6"
          >
            <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
            <p className="text-sm text-dim">
              <span className="font-medium text-ink">Para quién: </span>
              {s.paraQuien}
            </p>
            <p className="text-sm text-dim">
              <span className="font-medium text-ink">Qué entrego: </span>
              {s.entrego}
            </p>
            <ul className="flex flex-wrap gap-1.5" aria-label="Canales">
              {s.canales.map((c) => (
                <li
                  key={c}
                  className="rounded-(--radius-s) border border-line px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-wide text-dim"
                >
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-1 font-mono text-xs text-[color:var(--color-marketing-texto)]">{s.quien}</p>
            <p className="mt-auto border-t border-line pt-3 text-xs text-dim">{s.limite}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
