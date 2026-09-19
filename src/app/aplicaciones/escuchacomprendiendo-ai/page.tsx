import type { Metadata } from 'next';
import { escuchaProduct } from '@/data/escucha-comprendiendo';
import { appPath } from '@/data/apps';
import { t } from '@/i18n';
import ProductDemoExhibit from '@/components/exhibits/ProductDemoExhibit';
import SubpageNav from '@/components/layout/SubpageNav';

// Página propia de escuchacomprendiendo.ai (§ pedido de Samuel): acá vive TODO lo interactivo
// — ejemplo real, demo en vivo con audio propio o de muestra, y la descarga gateada. En la
// home solo queda la tarjeta-teaser que trae hasta acá.
const SLUG = 'escuchacomprendiendo-ai'; // = nombre de esta carpeta y del slug en src/data/apps.ts

export const metadata: Metadata = {
  title: 'escuchacomprendiendo.ai — de audio a decisiones citadas',
  description:
    'Grabás una nota de voz o una reunión. Te devuelve decisiones, tareas, riesgos y conceptos, cada uno con el segundo exacto del audio. Probalo en vivo en el navegador o descargá la app de escritorio.',
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
        escuchacomprendiendo.ai
      </h1>
      <p className="mt-5 max-w-2xl font-display text-xl font-semibold text-ink">{escuchaProduct.tagline}</p>
      <p className="mt-3 max-w-2xl text-lg text-dim">{escuchaProduct.descripcion}</p>

      <ProductDemoExhibit />

      <SubpageNav backHref="/#productos" backLabel={t.escucha.appBack} desde="productos" ctaLabel={t.escucha.appContact} />
    </article>
  );
}
