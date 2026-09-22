import { t } from '@/i18n';

// Dónde se aplica cada servicio (Samuel, 2026-09-22: "mostrar áreas de implementación de
// servicios"). Un cliente llega con una situación, no con el nombre de un servicio: seis
// situaciones típicas, qué servicios entran en cada una, quién responde y el caso real
// cuando existe (Xiaomi CarTech, LinkedIn de Samuel, Mamba Records — ningún otro). Va
// entre Servicios y Método: primero qué hacemos, después dónde aplica, después cómo.
export default function AreasCreative() {
  const { areas } = t.marketing;
  return (
    <section id="areas" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <header data-reveal="wipe" className="mb-10">
          <p className="font-mono text-sm text-[color:var(--color-marketing-texto)]">{areas.eyebrow}</p>
          <h2 className="mt-2 font-display text-h2 font-semibold">{areas.title}</h2>
          <p className="mt-3 max-w-xl text-dim">{areas.intro}</p>
        </header>

        <ol className="areas overflow-x-hidden">
          {areas.items.map((a, i) => (
            <li key={a.title} className="area" data-reveal={i % 2 === 0 ? 'left' : 'right'}>
              <span className="area__num">0{i + 1}</span>
              <h3 className="font-display text-lg font-semibold leading-tight text-ink">{a.title}</h3>
              <p className="text-sm text-dim">{a.situacion}</p>
              <dl className="area__meta">
                <div>
                  <dt>{areas.serviciosLabel}</dt>
                  <dd>
                    <ul className="area__servicios">
                      {a.servicios.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt>{areas.liderLabel}</dt>
                  <dd className="area__lider">{a.lider}</dd>
                </div>
                {a.ejemplo && (
                  <div>
                    <dt>{areas.ejemploLabel}</dt>
                    <dd className="area__ejemplo">{a.ejemplo}</dd>
                  </div>
                )}
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
