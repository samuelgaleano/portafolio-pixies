import type { TourStep } from '@/components/exhibits/StepTour';

// Recorrido guiado del proyecto de analítica (§12): resultados Saber 11 (ICFES, 2015-1)
// analizados en R por Samuel — de la base cruda al informe. Cada paso lleva una lámina
// generada desde los DATOS REALES del proyecto. TODAS las cifras del tour y del informe
// salen de dataFacts (única fuente): si un número cambia, cambia en un solo lugar.
export type DataStep = TourStep;

// Cifras verificadas contra los CSV del proyecto (sucia vs limpia) y stats calculadas.
export const dataFacts = {
  rowsDirty: 977,
  rowsClean: 965,
  dupes: 6,
  removed: 6, // registros retirados además de los duplicados
  repaired: 94, // valores rotos reparados en EVALUADOS (47) y PROMINGLES (47)
  natUnknown: 28, // NATURALEZA vacía → "DESCONOCIDO"
  ingMean: 54.3,
  ingMedian: 47.7,
  ingWeighted: 58.2,
  p10: 42.8,
  p90: 80.8,
  oficial: 116,
  noOficial: 849,
  brechaMat: 8.0,
  brechaIng: 10.6,
  corrMin: 0.89, // correlación mínima entre las 5 áreas
  corrMax: 0.95, // y la máxima
  r: 0.93, // lectura ↔ matemáticas
  r2: 0.87,
  slope: 1.17,
  intercept: -8.4,
} as const;

export interface DataTour {
  name: string;
  tagline: string;
  reportUrl: string; // informe completo (subpágina)
  modules: string[]; // badges de fases
  steps: DataStep[];
}

const f = dataFacts;

export const dataTour: DataTour = {
  name: 'Saber 11 (2015): del CSV sucio a un modelo que explica el puntaje',
  tagline: `Tomé una base pública del ICFES con ${f.rowsDirty} filas sucias — duplicados, texto donde iban números, comas decimales — y la convertí en un análisis completo en R: limpieza reproducible, exploración, la brecha oficial/no-oficial medida en puntos, y una regresión que explica el ${Math.round(f.r2 * 100)} % del puntaje de matemáticas.`,
  reportUrl: '/proyectos/analisis-saber11',
  modules: ['R · tidyverse', 'Limpieza', 'EDA', 'Estadística', 'Correlación', 'Regresión', 'Informe'],
  steps: [
    {
      id: 'limpieza',
      title: 'El problema: una base que no se dejaba analizar',
      business: `La base cruda traía ${f.rowsDirty} instituciones con duplicados exactos, municipios con espacios y minúsculas, números guardados como texto ("9.0", "nan", "-") y decimales con coma. Nada de eso se puede promediar ni graficar: primero hubo que domarla.`,
      tech: `Pipeline en R con tidyverse: distinct() eliminó ${f.dupes} duplicados exactos (más ${f.removed} registros retirados), los ${f.natUnknown} NA de NATURALEZA pasaron a "DESCONOCIDO", y EVALUADOS/PROMINGLES se repararon — ${f.repaired} valores rotos — con str_squish + parse_number (coma→punto, negativos→NA) e imputación por media de grupo. Las filas sin CALENDARIO se excluyen al modelar con na.omit().`,
      screenshot: '/proyectos/datos/limpieza.webp',
      alt: 'Comparación de la base cruda contra la base limpia: valores rotos resaltados en rojo y su versión corregida',
    },
    {
      id: 'distribucion',
      title: 'Explorar antes de opinar: la distribución de inglés',
      business: `Con la base limpia, lo primero es mirar la forma de los datos. El inglés promedia ${f.ingMean} pero la mediana es ${f.ingMedian}: la distribución es asimétrica — un grupo de colegios de alto puntaje jala la media hacia arriba mientras la mayoría queda por debajo.`,
      tech: `Histograma con binwidth 5 (el mismo del script) + curva de densidad; media, mediana, media ponderada por evaluados (${f.ingWeighted}) y percentiles P10/P90 (${f.p10} / ${f.p90}) calculados sobre las ${f.rowsClean} instituciones.`,
      screenshot: '/proyectos/datos/distribucion.webp',
      alt: 'Histograma y curva de densidad del promedio de inglés con la media y la mediana marcadas',
    },
    {
      id: 'brecha',
      title: 'La brecha oficial / no-oficial, medida en puntos',
      business: `Al segmentar por naturaleza del colegio, la diferencia es sistemática: los no oficiales superan a los oficiales en las 5 áreas. En matemáticas son +${f.brechaMat} puntos; en inglés la brecha llega a +${f.brechaIng} — la más grande del examen.`,
      tech: `Medias por grupo con group_by(NATURALEZA) + summarise() sobre lectura, matemáticas, sociales, ciencias e inglés; ${f.oficial} instituciones oficiales contra ${f.noOficial} no oficiales.`,
      screenshot: '/proyectos/datos/brecha.webp',
      alt: 'Barras agrupadas comparando el promedio de cada área entre colegios oficiales y no oficiales',
    },
    {
      id: 'correlacion',
      title: 'Todo se mueve junto (menos el tamaño del colegio)',
      business: `La matriz de correlaciones muestra que las 5 áreas académicas avanzan en bloque (r entre ${f.corrMin} y ${f.corrMax}): quien mejora en una, mejora en las demás. Y deja un hallazgo incómodo: el número de evaluados casi no se relaciona con el puntaje — el tamaño del colegio no explica el resultado.`,
      tech: 'Matriz de Pearson (pairwise) sobre p_lect, p_mat, p_soc, p_cien, p_ing y n_eval; contrastada con Spearman y Kendall en el script, y segmentada por naturaleza con group_map().',
      screenshot: '/proyectos/datos/correlacion.webp',
      alt: 'Matriz de correlación de Pearson entre las cinco áreas del examen y el número de evaluados',
    },
    {
      id: 'regresion',
      title: 'El modelo: lectura crítica predice matemáticas',
      business: `Una correlación de r = ${f.r} entre lectura y matemáticas da un modelo simple y accionable: cada punto adicional en lectura crítica se asocia con +${f.slope} en matemáticas. Si una secretaría quiere subir matemáticas, invertir en comprensión lectora es la palanca con más evidencia.`,
      tech: `Dispersión de ${f.rowsClean} instituciones + recta de mínimos cuadrados: p_mat = ${f.intercept} + ${f.slope}·p_lect, r² = ${f.r2}. En el script: cor() + geom_smooth(method = "lm") con facetas por naturaleza y jornada.`,
      screenshot: '/proyectos/datos/regresion.webp',
      alt: 'Diagrama de dispersión de lectura crítica contra matemáticas con la recta de regresión ajustada',
    },
  ],
};

// Vista NARRATIVA para la home (rediseño Samuel 2026-07-18): lo importante primero — con
// qué fin, cómo, y qué concluí — no el paso a paso completo. El detalle (láminas, código,
// tablas) vive en el informe y se abre con botones específicos. Cifras desde dataFacts.
export const dataCase = {
  // se presenta EMPAQUETADO como un proyecto (habrá más de analítica, como los demás productos)
  project: 'Saber 11 · ICFES 2015',
  eyebrow: '/análisis · R',
  // título con nombre de PROYECTO de analítica (Samuel r3): que se lea como un estudio
  title: 'Análisis de tendencias en resultados educativos',
  subtitle: 'Qué mueve el puntaje de un colegio y dónde está la brecha',
  blocks: [
    {
      label: '¿Con qué fin?',
      body: 'Quería responder con datos, no con opinión: ¿qué mueve de verdad el puntaje de un colegio en las pruebas Saber 11, y hay una brecha real entre colegios oficiales y no oficiales? Tomé la base pública del ICFES y la trabajé de principio a fin en R.',
    },
    {
      label: '¿Cómo lo hice?',
      body: `Limpieza reproducible de ${f.rowsDirty} → ${f.rowsClean} instituciones (duplicados, números guardados como texto, decimales con coma, categorías vacías), exploración de las distribuciones, la brecha por naturaleza del colegio, una matriz de correlaciones y una regresión lineal. Reconcilié cada cifra contra la base: un análisis que no se puede reproducir no es un análisis.`,
    },
    {
      label: '¿Qué logré concluir?',
      body: `Las cinco áreas se mueven en bloque y el tamaño del colegio casi no explica el resultado. La palanca con más evidencia es la comprensión lectora: cada punto en lectura crítica se asocia con +${f.slope} en matemáticas (r² = ${f.r2}). Y la brecha oficial/no-oficial es sistemática — hasta +${f.brechaIng} puntos en inglés.`,
    },
  ],
  stats: [
    { v: `${f.rowsDirty} → ${f.rowsClean}`, k: 'filas depuradas' },
    { v: `r² ${f.r2}`, k: 'del puntaje explicado' },
    { v: `+${f.slope}`, k: 'mat. por punto de lectura' },
    { v: `+${f.brechaIng}`, k: 'brecha en inglés (pts)' },
  ],
  reportUrl: '/proyectos/analisis-saber11',
} as const;
