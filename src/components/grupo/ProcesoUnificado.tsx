import Link from 'next/link';
import { t } from '@/i18n';

const ETIQUETA_LADO = { creative: 'equipo Creative', web: 'equipo Web', ambas: 'los dos equipos' } as const;

// La ruta de un proyecto, en la home y justo debajo de la bifurcación.
//
// Samuel (2026-09-22 · 2ª ronda): "títulos y subtítulos mucho más simples, muy directo al
// cliente", "el roadmap, visualmente más disruptivo y con flechas que se entienda", y
// sobre todo **cada paso es un botón**: al oprimirlo lleva a la sección donde ese trabajo
// ya está hecho (marca → Creative, web → catálogo de sitios, sistemas → el ERP en vivo,
// datos → el análisis real). De 8 pasos a 6: arquitectura y construcción se fusionan en
// "Web" y entra "Sistemas" (soluciones empresariales). El color sigue diciendo qué equipo
// lo ejecuta, sin rótulo (el rótulo va solo para lectores de pantalla), y una flecha
// encadena un paso con el siguiente. Cierra con el bucle de conocimiento: lo que se
// aprende vuelve a entrar por la app propia.
export default function ProcesoUnificado() {
  const { proceso } = t;
  return (
    <section id="proceso" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <header data-reveal="wipe" className="mb-9 max-w-2xl">
          <p className="font-mono text-sm text-data">{proceso.eyebrow}</p>
          <h2 className="mt-2 font-display text-h2 font-semibold">{proceso.title}</h2>
          <p className="mt-2 text-dim">{proceso.intro}</p>
        </header>

        <ol className="ruta" data-reveal>
          {proceso.pasos.map((p) => (
            <li key={p.n} className={`ruta__item ruta__item--${p.lado}`}>
              <Link href={p.href} className="ruta__paso">
                <span className="ruta__num">
                  {p.n}
                  <span className="sr-only"> · {ETIQUETA_LADO[p.lado]}</span>
                </span>
                <h3 className="ruta__title">{p.title}</h3>
                <p className="ruta__desc">{p.desc}</p>
                <span className="ruta__destino">{p.destino} →</span>
              </Link>
            </li>
          ))}
        </ol>

        <div data-reveal className="ruta-cierre">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">{proceso.cierreTitle}</h3>
            <p className="mt-1 max-w-2xl text-sm text-dim">{proceso.cierreBody}</p>
            <Link href={proceso.cierreHref} className="link-draw mt-2 inline-block font-mono text-xs text-data">
              {proceso.cierreCta}
            </Link>
          </div>
          <a
            href="#contacto"
            data-desde="proceso"
            className="press inline-flex min-h-12 shrink-0 items-center justify-center rounded-(--radius-s) bg-signal px-6 font-semibold text-void transition hover:brightness-110"
          >
            {proceso.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
