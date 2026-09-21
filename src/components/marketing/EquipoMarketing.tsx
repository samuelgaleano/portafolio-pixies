import { t } from '@/i18n';
import Pending from '@/components/ui/Pending';

// Equipo de Marketing (empresas/pixies/core/equipo/*): Samuel ya tiene foto real (la
// misma del hero de /samuel); Edison e Isabela usan el mismo Pending "en construcción"
// que el resto del sitio hasta que lleguen los retratos.
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

        <ul data-reveal className="flex flex-col divide-y divide-line border-y border-line">
          {equipo.personas.map((p) => (
            <li key={p.nombre} className="grid grid-cols-[72px_1fr] gap-4 py-6 sm:grid-cols-[96px_1fr_1fr]">
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
              <div>
                <h3 className="font-display text-lg font-bold text-ink">{p.nombre}</h3>
                <p className="font-mono text-xs uppercase tracking-wide text-[color:var(--color-marketing-texto)]">{p.cargo}</p>
                <p className="mt-2 text-[1.05rem] font-medium text-ink">{p.rol}</p>
              </div>
              <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
                <p className="text-sm text-dim">{p.bio}</p>
                {p.cita && <p className="text-sm italic text-dim">&ldquo;{p.cita}&rdquo;</p>}
                {p.trayectoria && <p className="font-mono text-xs text-dim">{p.trayectoria}</p>}
                {!p.foto && <Pending>foto en construcción</Pending>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
