import type { Metadata } from 'next';
import Link from 'next/link';
import { dataTour, dataFacts as f } from '@/data/data-tour';

// Informe completo del análisis Saber 11 (ICFES 2015-1) hecho en R. TODAS las cifras
// vienen de dataFacts (misma fuente que el tour de la home): un número, un lugar.
export const metadata: Metadata = {
  title: 'Análisis Saber 11 (2015) en R — informe',
  description:
    'De una base pública sucia del ICFES a un modelo: limpieza reproducible en R, brecha oficial/no-oficial y una regresión que explica el 87 % del puntaje de matemáticas.',
  alternates: { canonical: '/proyectos/analisis-saber11' },
};

const kpis = [
  [`${f.rowsDirty} → ${f.rowsClean}`, 'filas: crudas → limpias'],
  [`+${f.brechaIng} pts`, 'brecha no-oficial en inglés'],
  [`r = ${f.r}`, 'lectura ↔ matemáticas'],
  [`r² = ${f.r2}`, 'varianza explicada por el modelo'],
] as const;

// Extractos REALES de los scripts del proyecto (R · tidyverse), recortados para lectura.
const codeLimpieza = `Data2 <- Data2 %>%
  mutate(
    EVALUADOS = str_squish(EVALUADOS),          # quita espacios extra
    EVALUADOS = na_if(EVALUADOS, ""),           # "" -> NA
    EVALUADOS = na_if(EVALUADOS, "-"),          # "-" -> NA
    EVALUADOS = na_if(EVALUADOS, "NA"),         # "NA" -> NA
    EVALUADOS = parse_number(EVALUADOS),        # texto -> número
    EVALUADOS = as.integer(round(EVALUADOS)),
    EVALUADOS = if_else(EVALUADOS < 0L, NA_integer_, EVALUADOS)
  )

Data2 <- Data2 %>%
  group_by(CALENDARIO) %>%
  mutate(PROMINGLES = if_else(is.na(PROMINGLES),
                              mean(PROMINGLES, na.rm = TRUE),
                              PROMINGLES)) %>%
  ungroup()`;

const codeCorrelacion = `cor(Datos %>% select(p_lect, p_mat,
                     p_soc, p_cien,
                     p_ing, n_eval), method = "pearson")

# segmentado por naturaleza del colegio
Datos %>%
  group_by(nat) %>%
  group_map(~ cor(select(.x, p_lect, p_mat, p_soc,
                         p_cien, p_ing, n_eval),
                  method = "pearson"))`;

const codeRegresion = `ggplot(Datos, aes(x = p_lect, y = p_mat)) +
  geom_point(alpha = 0.6, size = 2) +
  geom_smooth(method = "lm", se = TRUE) +
  facet_grid(nat ~ jor) +
  labs(title = "Lectura crítica vs matemáticas",
       x = "Promedio lectura crítica",
       y = "Promedio matemáticas")`;

function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="mt-6 overflow-hidden rounded-(--radius-m) border border-line bg-surface-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={1500} height={938} loading="lazy" decoding="async" className="h-auto w-full" />
      <figcaption className="border-t border-line px-4 py-3 font-mono text-xs text-dim">{caption}</figcaption>
    </figure>
  );
}

function Code({ label, code }: { label: string; code: string }) {
  return (
    <div className="mt-6 overflow-hidden rounded-(--radius-m) border border-line">
      <p className="border-b border-line bg-surface-2 px-4 py-2 font-mono text-xs text-data">{label}</p>
      {/* tabIndex: la región scrollea horizontal — accesible por teclado (WCAG 2.1.1) */}
      <pre
        tabIndex={0}
        aria-label={label}
        className="overflow-x-auto bg-surface p-4 font-mono text-[0.8125rem] leading-relaxed text-dim"
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function InformeSaber11() {
  const [sLimpieza, sDistribucion, sBrecha, sCorrelacion, sRegresion] = dataTour.steps;
  return (
    <article className="mx-auto w-full max-w-[860px] px-4 pt-28 pb-20 sm:px-6">
      <p className="font-mono text-sm text-data">/proyectos · analítica de datos · R</p>
      <h1 className="mt-3 font-display text-hero font-bold text-ink">{dataTour.name}</h1>
      <p className="mt-5 max-w-2xl text-lg text-dim">{dataTour.tagline}</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map(([v, l]) => (
          <div key={l} className="depth-card p-4">
            <p className="font-mono text-xl font-bold text-ink [font-variant-numeric:tabular-nums]">{v}</p>
            <p className="mt-1 text-xs text-dim">{l}</p>
          </div>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="font-display text-h2 font-semibold text-ink">1 · El problema y la limpieza</h2>
        <p className="mt-4 text-dim">
          La base pública del ICFES (Saber 11, 2015-1) llegó con {f.rowsDirty} instituciones y de todo un
          poco: {f.dupes} duplicados exactos, municipios con espacios y minúsculas mezcladas, números
          guardados como texto («9.0», «nan», «-») y decimales con coma. Antes de opinar sobre educación,
          tocó arreglar la materia prima — y dejarlo reproducible, no a punta de Excel.
        </p>
        <Figure src={sLimpieza.screenshot} alt={sLimpieza.alt} caption="Antes / después: los valores rotos de la base cruda, resaltados, y su versión limpia." />
        <p className="mt-4 text-dim">{sLimpieza.tech}</p>
      </section>

      <section id="resultados" className="mt-14 scroll-mt-28">
        <h2 className="font-display text-h2 font-semibold text-ink">2 · Exploración: la forma de los datos</h2>
        <p className="mt-4 text-dim">
          El inglés promedia {f.ingMean} puntos, pero la mediana está en {f.ingMedian}: la distribución es
          asimétrica, con un grupo de colegios de alto puntaje jalando la media hacia arriba. La media
          ponderada por evaluados ({f.ingWeighted}) confirma que los colegios grandes rinden por encima del
          colegio típico. Entre el percentil 10 ({f.p10}) y el 90 ({f.p90}) hay casi 38 puntos de distancia —
          el «promedio nacional» esconde realidades muy distintas.
        </p>
        <Figure src={sDistribucion.screenshot} alt={sDistribucion.alt} caption="Histograma (binwidth 5) + densidad del promedio de inglés; media, mediana y percentiles reales." />
      </section>

      <section className="mt-14">
        <h2 className="font-display text-h2 font-semibold text-ink">3 · La brecha oficial / no-oficial</h2>
        <p className="mt-4 text-dim">
          Segmentando por naturaleza ({f.oficial} oficiales vs {f.noOficial} no oficiales), la diferencia es
          sistemática: los no oficiales ganan en las cinco áreas. En matemáticas la brecha es de +{f.brechaMat}{' '}
          puntos y en inglés llega a +{f.brechaIng}, la mayor del examen. No es una anécdota de un área: es un
          patrón transversal.
        </p>
        <Figure src={sBrecha.screenshot} alt={sBrecha.alt} caption="Medias reales por área y naturaleza del colegio." />
      </section>

      <section className="mt-14">
        <h2 className="font-display text-h2 font-semibold text-ink">4 · Correlaciones: qué se mueve con qué</h2>
        <p className="mt-4 text-dim">
          Las cinco áreas académicas están fuertemente correlacionadas entre sí (r entre {f.corrMin} y{' '}
          {f.corrMax}): el rendimiento viaja en bloque. El contraste interesante es el número de evaluados,
          que apenas se relaciona con el puntaje — el tamaño del colegio, por sí solo, no explica el
          resultado.
        </p>
        <Figure src={sCorrelacion.screenshot} alt={sCorrelacion.alt} caption="Matriz de Pearson (pairwise) sobre las cinco áreas y el número de evaluados." />
      </section>

      <section className="mt-14">
        <h2 className="font-display text-h2 font-semibold text-ink">5 · El modelo: lectura como palanca</h2>
        <p className="mt-4 text-dim">
          La correlación lectura ↔ matemáticas (r = {f.r}) da un modelo simple:{' '}
          <span className="font-mono text-ink">
            p_mat = {f.intercept} + {f.slope}·p_lect
          </span>{' '}
          con r² = {f.r2}. Cada punto adicional en lectura crítica se asocia con +{f.slope} puntos en
          matemáticas. La lectura conclusión-para-negocio: si una secretaría de educación quiere mover
          matemáticas, la palanca con más evidencia en estos datos es la comprensión lectora — y la brecha
          oficial/no-oficial marca dónde priorizar la inversión.
        </p>
        <Figure src={sRegresion.screenshot} alt={sRegresion.alt} caption={`${f.rowsClean} instituciones, recta de mínimos cuadrados y ajuste del modelo.`} />
      </section>

      <section id="codigo" className="mt-14 scroll-mt-28">
        <h2 className="font-display text-h2 font-semibold text-ink">‹/› El código R (extractos reales)</h2>
        <p className="mt-4 text-dim">
          Todo el análisis vive en scripts de R con tidyverse — reproducible de punta a punta. Estos son los
          tres momentos clave, tal como están en el proyecto:
        </p>
        <Code label="limpieza · reparar EVALUADOS y PROMINGLES (dplyr + stringr + readr)" code={codeLimpieza} />
        <Code label="correlaciones · matriz de Pearson y segmentación por naturaleza" code={codeCorrelacion} />
        <Code label="modelo · dispersión + recta lm con facetas (ggplot2)" code={codeRegresion} />
      </section>

      <section className="mt-14">
        <h2 className="font-display text-h2 font-semibold text-ink">Conclusiones</h2>
        <ul className="mt-4 flex flex-col gap-3 text-dim">
          {[
            `Una base pública sucia se volvió analizable con un pipeline reproducible en R: ${f.rowsDirty} → ${f.rowsClean} filas útiles, cada decisión de limpieza documentada en el script.`,
            `La brecha oficial / no-oficial es transversal: +${f.brechaMat} puntos en matemáticas y +${f.brechaIng} en inglés a favor de los colegios no oficiales.`,
            `El rendimiento académico viaja en bloque (áreas correlacionadas entre ${f.corrMin} y ${f.corrMax}); el tamaño del colegio casi no pesa.`,
            `Lectura crítica es el mejor predictor de matemáticas entre las variables analizadas (r² = ${f.r2}): invertir en comprensión lectora es la recomendación con más soporte.`,
          ].map((c) => (
            <li key={c} className="flex gap-3">
              <span className="text-pixel" aria-hidden="true">▸</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-xs text-dim">
          Fuente: resultados agregados por institución, Saber 11 (ICFES), periodo 2015-1 · análisis propio en R.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/#datos"
          className="inline-block rounded-(--radius-s) border border-line px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
        >
          ← Volver al portafolio
        </Link>
        <Link
          href="/#contacto"
          data-desde="datos"
          className="press inline-block rounded-(--radius-s) bg-signal px-4 py-2 font-mono text-xs font-medium text-void transition hover:brightness-110"
        >
          ¿Tienes datos así de sucios? Hablemos →
        </Link>
      </div>
    </article>
  );
}
