import { t } from '@/i18n';

// Cinco servicios de Creative como los "cubos" del mockup 15-final-ajustado.html (Samuel,
// 2026-09-21: "la selección de servicios se ve genial, impleméntala así"): retícula de 6
// columnas con ritmo 2·2·2·3·3, número en mono con el acento de la división, filete
// superior de 5px en --acento, dos cubos tintados (--acento-suave) para dar ritmo, y los
// canales como chips. Contenido de servicios/*.md, en voz empresarial.
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
            className={`cubo${i === 1 || i === 4 ? ' cubo--tinta' : ''}`}
          >
            <span className="cubo__num">0{i + 1}</span>
            <h3 className="font-display text-xl font-semibold text-ink">{s.title}</h3>
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
          </article>
        ))}
      </div>
    </section>
  );
}
