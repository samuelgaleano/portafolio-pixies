import type { Metadata } from 'next';
import { escuchaProduct } from '@/data/escucha-comprendiendo';
import { appPath } from '@/data/apps';
import { t } from '@/i18n';
import ProductDemoExhibit from '@/components/exhibits/ProductDemoExhibit';
import SubpageNav from '@/components/layout/SubpageNav';

// Página propia de escuchacomprendiendo.IA (§ pedido de Samuel): acá vive TODO lo interactivo
// — ejemplo real, demo en vivo con audio propio o de muestra, y la descarga gateada. En la
// home solo queda la tarjeta-teaser que trae hasta acá.
const SLUG = 'escuchacomprendiendo-ai'; // = nombre de esta carpeta y del slug en src/data/apps.ts

export const metadata: Metadata = {
  title: 'escuchacomprendiendo.IA — de audio a contexto conectado',
  // La descripción sale del producto (dueño único): así el buscador, la tarjeta y la página
  // cuentan lo mismo, y cambiar el posicionamiento se hace en un solo sitio.
  description: escuchaProduct.descripcion,
  alternates: { canonical: appPath(SLUG) },
};

export default function EscuchaComprendiendoPage() {
  return (
    <article className="mx-auto w-full max-w-[960px] px-4 pt-28 pb-20 sm:px-6">
      <p className="font-mono text-sm text-data">{t.escucha.appEyebrow}</p>
      {/* El nombre es UNA palabra de 23 caracteres sin punto de quiebre: --text-hero (piso 36px)
          la desbordaba en todo móvil. Tamaño fluido calibrado para caber en una línea a 320px,
          y overflow-wrap:anywhere como red por si la métrica de la fuente cambia. */}
      <h1 className="mt-3 font-display text-[clamp(1.375rem,6.5vw,4rem)] leading-[1.02] font-bold text-ink [overflow-wrap:anywhere]">
        escuchacomprendiendo.IA
      </h1>
      <p className="mt-5 max-w-2xl font-display text-xl font-semibold text-ink">{escuchaProduct.tagline}</p>

      {/* Explicación MUY concreta y corta, y la demo justo debajo (Samuel, 2026-09-23): antes
          había que leer dos párrafos largos antes de llegar a algo que se pudiera tocar. */}
      <section aria-labelledby="que-hace" className="escucha-intro">
        <h2 id="que-hace" className="escucha-intro__titulo">
          {t.escucha.introQue}
        </h2>
        <ol className="escucha-intro__lista">
          {t.escucha.introPuntos.map((p, i) => (
            <li key={p.titulo} className="escucha-intro__punto">
              <span className="escucha-intro__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <b>{p.titulo}</b>
              <span>{p.cuerpo}</span>
            </li>
          ))}
        </ol>
        <p className="escucha-intro__obsidian">{t.escucha.introObsidian}</p>
      </section>

      <details className="escucha-condiciones">
        <summary>{t.escucha.condicionesTitulo}</summary>
        <ul>
          {t.escucha.condiciones.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </details>

      <ProductDemoExhibit />

      <SubpageNav backHref="/web#productos" backLabel={t.escucha.appBack} desde="productos" ctaLabel={t.escucha.appContact} />
    </article>
  );
}
