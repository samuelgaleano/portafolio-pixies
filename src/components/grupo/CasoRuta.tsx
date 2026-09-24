import Link from 'next/link';
import { t } from '@/i18n';

const ETIQUETA_LADO = { creative: 'equipo Creative', web: 'equipo Web', ambas: 'los dos equipos' } as const;

// Roadmap de EJEMPLO, debajo de los seis pasos del método (Samuel, 2026-09-23: "abajo otro
// roadmap pero un poco más explicativo, un ejemplo — Specifinance, que se le hizo todo desde
// el brief").
//
// Por qué es un componente aparte y no seis pasos más: los de arriba son el MÉTODO y cada uno
// es un botón que salta a donde ese trabajo está hecho. Este de aquí es un RELATO — un solo
// cliente, en orden, con lo que salió de cada paso. Por eso es una línea de tiempo continua y
// no una rejilla de botones: se lee de corrido, no se navega.
export default function CasoRuta() {
  const { proceso } = t;
  return (
    <div data-reveal className="caso-ruta">
      <header className="caso-ruta__head">
        <p className="caso-ruta__eyebrow">{proceso.casoEyebrow}</p>
        <h3 className="caso-ruta__title">{proceso.casoTitle}</h3>
        <p className="caso-ruta__intro">{proceso.casoIntro}</p>
      </header>

      <ol className="caso-ruta__pasos">
        {proceso.casoPasos.map((p) => (
          <li key={p.n} className={`caso-paso caso-paso--${p.lado}`}>
            <span className="caso-paso__marca" aria-hidden="true" />
            <span className="caso-paso__num">
              {p.n}
              <span className="sr-only"> · {ETIQUETA_LADO[p.lado as keyof typeof ETIQUETA_LADO]}</span>
            </span>
            <h4 className="caso-paso__title">{p.title}</h4>
            <p className="caso-paso__desc">{p.desc}</p>
            <span className="caso-paso__crea">{p.crea}</span>
          </li>
        ))}
      </ol>

      <Link href={proceso.casoHref} className="link-draw caso-ruta__cta">
        {proceso.casoCta}
      </Link>
    </div>
  );
}
