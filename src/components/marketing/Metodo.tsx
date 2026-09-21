import { t } from '@/i18n';

// Método con dueño (marketing/CLAUDE.md, fases 3-9 del flujo real de Pixies Marketing,
// resumidas a 6 con responsable por fase — mismo patrón que la sección "Como se unen"
// del mockup 15-final-ajustado.html).
export default function Metodo() {
  const { metodo } = t.marketing;
  return (
    <section id="metodo" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <header data-reveal="wipe" className="mb-10">
          <p className="font-mono text-sm text-[color:var(--color-marketing-texto)]">{metodo.eyebrow}</p>
          <h2 className="mt-2 font-display text-h2 font-semibold">{metodo.title}</h2>
          <p className="mt-3 max-w-xl text-dim">{metodo.intro}</p>
        </header>

        <ol data-reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metodo.fases.map((f) => (
            <li key={f.n} className="rounded-(--radius-m) border border-line bg-surface p-5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xs text-data">{f.n}</span>
                <span
                  className="rounded-(--radius-s) px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-wide text-ink"
                  style={{ background: 'var(--color-marketing-suave)' }}
                >
                  {f.dueno}
                </span>
              </div>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-1 text-sm text-dim">{f.desc}</p>
            </li>
          ))}
        </ol>

        <p
          data-reveal
          className="mt-6 rounded-(--radius-m) px-5 py-4 text-center font-display text-lg font-semibold"
          style={{ background: 'var(--color-ink)', color: 'var(--color-marketing)' }}
        >
          {metodo.regla}
        </p>
      </div>
    </section>
  );
}
