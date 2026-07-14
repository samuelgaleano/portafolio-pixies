import { categories } from '@/data/categories';
import { t } from '@/i18n';

// Marquee de servicios (spec capa-viva, referencia WAIRK): franja mono entre el hero
// y el portafolio. CSS puro en compositor; pausa en hover; estático con reduced-motion.
// El track se duplica (segunda copia aria-hidden) para el loop sin costura.
const row = (hidden: boolean) => (
  <span aria-hidden={hidden || undefined} className="inline-flex items-center">
    {categories.map((c) => (
      <span key={c.id} className="inline-flex items-center">
        <span className="px-6">{c.heroLabel}</span>
        <span className="text-pixel" aria-hidden="true">
          ▪
        </span>
      </span>
    ))}
  </span>
);

export default function ServicesMarquee() {
  return (
    <div className="marquee border-y border-line py-3 font-mono text-sm text-dim" aria-label={t.marquee.label}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
