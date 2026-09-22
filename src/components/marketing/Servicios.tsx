import { t } from '@/i18n';

// Los cinco servicios de Creative, como "cubos" (mockup 15-final-ajustado.html).
//
// Samuel (2026-09-22 · 2ª ronda): "ser más visual en lo que se ofrece, lo que le interesa
// al cliente directamente, y que puedan OPRIMIR — que no sea solo leer — con qué se puede
// ayudar, qué ofrecemos". Por eso cada cubo abre con un **ícono en píxeles** y con **con
// qué te ayudamos** en las palabras del cliente, y **todo el cubo es oprimible**: lleva al
// formulario marcando de qué servicio viene (enlace estirado, el resto del texto sigue
// seleccionable). Debajo se mantiene lo que ya había: canales, entrega, para quién, quién
// responde y el límite honesto.
export default function Servicios() {
  const { servicios } = t.marketing;
  return (
    <section id="servicios" className="mx-auto w-full max-w-[1200px] scroll-mt-16 px-4 py-20 sm:px-6">
      <header data-reveal="wipe" className="mb-10">
        <p className="font-mono text-sm text-[color:var(--acento-texto)]">{servicios.eyebrow}</p>
        <h2 className="mt-2 font-display text-h2 font-semibold">{servicios.title}</h2>
        <p className="mt-3 max-w-xl text-dim">{servicios.intro}</p>
      </header>

      {/* overflow-x-hidden: contiene el translateX de los data-reveal="left|right" mientras el
          grid sigue fuera de viewport (sin esto crea scroll horizontal real). */}
      <div className="cubos overflow-x-hidden">
        {servicios.items.map((s, i) => (
          <article
            key={s.title}
            data-reveal={i % 2 === 0 ? 'left' : 'right'}
            className={`cubo${i === 0 || i === 3 ? ' cubo--tinta' : ''}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="cubo__icono" aria-hidden="true">
                {s.icono.map((fila, y) =>
                  fila.split('').map((bit, x) => <i key={`${y}-${x}`} className={bit === '1' ? 'on' : undefined} />)
                )}
              </span>
              <span className="cubo__lider">
                <span className="cubo__lider-label">{servicios.liderLabel}</span> {s.lider}
              </span>
            </div>

            <h3 className="font-display text-xl font-semibold leading-tight text-ink">{s.title}</h3>
            <p className="cubo__ayuda">{s.ayuda}</p>

            <ul className="cubo__canales" aria-label="Canales">
              {s.canales.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="cubo__entrega">{s.entrego}</p>
            <p className="cubo__para">
              <span className="text-ink">Para quién: </span>
              {s.paraQuien}
            </p>
            <p className="cubo__quien">{s.quien}</p>
            <p className="cubo__limite">{s.limite}</p>

            {/* enlace estirado: el cubo entero es oprimible sin envolver el texto en un <a> */}
            <a href="#contacto" data-desde={s.desde} className="cubo__pedir">
              {servicios.pedir} <span aria-hidden="true">→</span>
              <span className="sr-only"> — {s.title}</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
