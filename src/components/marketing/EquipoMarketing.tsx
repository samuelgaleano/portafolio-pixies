import { t } from '@/i18n';
import Pending from '@/components/ui/Pending';

// Equipo de Creative (empresas/pixies/core/equipo/*). Tres tarjetas, una por frente, en el
// orden de prioridad que fijó Samuel (2026-09-22): Isabela lidera campañas y redes y va
// primera y destacada (filete ámbar, tarjeta más ancha); Edison marca; Samuel crecimiento y
// datos. Cada tarjeta lista QUÉ lidera esa persona — es lo que un cliente necesita saber
// para entender a quién le está hablando. Samuel ya tiene foto real (la misma del hero de
// /samuel); Edison e Isabela usan el mismo Pending "en construcción" que el resto del sitio
// hasta que lleguen los retratos.
export default function EquipoMarketing() {
  const { equipo } = t.marketing;
  return (
    <section id="equipo" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <header data-reveal="wipe" className="mb-10">
          <p className="font-mono text-sm text-[color:var(--color-marketing-texto)]">{equipo.eyebrow}</p>
          <h2 className="mt-2 font-display text-h2 font-semibold">{equipo.title}</h2>
          <p className="mt-3 max-w-xl text-dim">{equipo.intro}</p>
        </header>

        <ul className="equipo overflow-x-hidden">
          {equipo.personas.map((p, i) => (
            <li
              key={p.nombre}
              data-reveal={i === 0 ? 'left' : i === 1 ? undefined : 'right'}
              className={`equipo__card${p.destacada ? ' equipo__card--lidera' : ''}`}
            >
              <div className="flex items-start gap-4">
                <span className="relative block size-[72px] shrink-0 overflow-hidden rounded-(--radius-m) border border-line bg-surface-2 sm:size-24" aria-hidden="true">
                  {p.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.foto} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-dim">
                      {p.nombre[0]}
                    </span>
                  )}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-ink">{p.nombre}</h3>
                  <p className="font-mono text-xs uppercase tracking-wide text-[color:var(--color-marketing-texto)]">{p.cargo}</p>
                  {!p.foto && (
                    <p className="mt-1">
                      <Pending>foto en construcción</Pending>
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-4 text-[1.05rem] font-medium leading-snug text-ink">{p.rol}</p>

              <div className="mt-3">
                <p className="font-mono text-[0.68rem] uppercase tracking-wide text-dim">{equipo.lideraLabel}</p>
                <ul className="equipo__lidera" aria-label={`${equipo.lideraLabel}: ${p.nombre}`}>
                  {p.lidera.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 text-sm text-dim">{p.bio}</p>
              {p.cita && <p className="mt-2 text-sm italic text-dim">&ldquo;{p.cita}&rdquo;</p>}
              {p.trayectoria && <p className="mt-2 font-mono text-xs text-dim">{p.trayectoria}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
