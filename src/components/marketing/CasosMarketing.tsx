import { t } from '@/i18n';
import Pending from '@/components/ui/Pending';

// Casos de Marketing (portafolio/casos/*.md): Mamba Records y Xiaomi CarTech se cuentan
// sin número (fases pendientes / cifras por confirmar); LinkedIn de Samuel sí trae el
// dato real y verificado. Ningún porcentaje huérfano, ninguna cifra inventada.
export default function CasosMarketing() {
  const { casos } = t.marketing;
  return (
    <section id="casos" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <header data-reveal="wipe" className="mb-10">
          <p className="font-mono text-sm text-[color:var(--color-marketing-texto)]">{casos.eyebrow}</p>
          <h2 className="mt-2 font-display text-h2 font-semibold">{casos.title}</h2>
          <p className="mt-3 max-w-xl text-dim">{casos.intro}</p>
        </header>

        <div className="grid gap-5 sm:grid-cols-3">
          {casos.items.map((c) => (
            <article key={c.title} className="border-t-2 pt-4" style={{ borderColor: 'var(--color-marketing)' }} data-reveal>
              <p className="font-mono text-[0.68rem] uppercase tracking-wide text-dim">{c.tag}</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-ink">{c.title}</h3>
              <p className="mt-2 text-sm text-dim">{c.desc}</p>
              {c.cifra && (
                <p className="mt-3 font-display text-3xl font-bold text-ink">
                  {c.cifra}
                  <span className="ml-2 font-mono text-xs font-normal text-dim">{c.cifraLabel}</span>
                </p>
              )}
              {c.pendiente && (
                <p className="mt-3">
                  <Pending>cifras por confirmar</Pending>
                </p>
              )}
              <p className="mt-3 text-xs text-dim">{c.nota}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
