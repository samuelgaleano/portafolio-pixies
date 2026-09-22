import { t } from '@/i18n';

const ETIQUETA_LADO = { creative: 'equipo Creative', web: 'equipo Web', ambas: 'los dos equipos' } as const;

// Un proyecto de punta a punta (home, justo debajo de la bifurcación). Samuel (2026-09-21):
// corto y directo, que muestre TODO lo que hace Pixies Design Group sin obligar a elegir
// división. Ocho pasos con el color del equipo que los ejecuta — implícito (color), no un
// rótulo; el rótulo va solo para lectores de pantalla. Dos casos reales como ejemplo, cada
// uno con los pasos que recorrió de verdad. Mismo patrón de cabecera que el resto del sitio.
export default function ProcesoUnificado() {
  const { proceso } = t;
  return (
    <section id="proceso" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <header data-reveal="wipe" className="mb-10 max-w-2xl">
          <p className="font-mono text-sm text-data">{proceso.eyebrow}</p>
          <h2 className="mt-2 font-display text-h2 font-semibold">{proceso.title}</h2>
          <p className="mt-3 text-dim">{proceso.intro}</p>
        </header>

        <ol className="proceso-uni" data-reveal>
          {proceso.pasos.map((p) => (
            <li key={p.n} className={`paso paso--${p.lado}`}>
              <span className="paso__num">
                {p.n}
                <span className="sr-only"> · {ETIQUETA_LADO[p.lado]}</span>
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
              <p className="text-sm text-dim">{p.desc}</p>
            </li>
          ))}
        </ol>

        <div data-reveal className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="proceso-uni__ejemplos">
            <dl>
              {proceso.ejemplos.map((e) => (
                <div key={e.nombre} className="flex flex-wrap gap-x-2 text-sm">
                  <dt className="font-display font-semibold text-ink">{e.nombre}</dt>
                  <dd className="text-dim">{e.recorrido}</dd>
                </div>
              ))}
            </dl>
            {/* fuera del <dl>: un <p> dentro no es HTML válido (Lighthouse definition-list) */}
            <p className="mt-2 font-mono text-xs text-dim">{proceso.nota}</p>
          </div>
          <a
            href="#contacto"
            data-desde="proceso"
            className="press inline-flex min-h-12 items-center justify-center rounded-(--radius-s) bg-signal px-6 font-semibold text-void transition hover:brightness-110"
          >
            {proceso.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
