import { t } from '@/i18n';
import PixelGlyph from '@/components/ui/PixelGlyph';

// Statement editorial (spec capa-viva, referencia clicktokeep): afirmaciones gigantes,
// solo verificables (regla PRODUCT.md). Reveal por línea con el sistema data-reveal
// existente; el stagger va por transition-delay inline.
export default function Statement() {
  return (
    <section className="border-t border-line" aria-label={t.statement.label}>
      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-28 sm:px-6 sm:py-36">
        <PixelGlyph
          name="cluster"
          className="absolute right-6 top-10 hidden text-[10px] text-pixel-soft/40 sm:block"
        />
        <div className="flex flex-col gap-6">
          {t.statement.lines.map((line, i) => (
            <p
              key={line.plain}
              data-reveal
              style={{ transitionDelay: `${i * 0.12}s` }}
              className="font-display text-[clamp(1.9rem,5vw,4.2rem)] font-semibold leading-[1.08] text-ink"
            >
              {line.pre}
              <span className="text-pixel-soft">{line.em}</span>
              {line.post}
            </p>
          ))}
        </div>
        <p data-reveal className="mt-10 font-mono text-sm text-dim" style={{ transitionDelay: '0.4s' }}>
          {t.statement.footnote}
        </p>
      </div>
    </section>
  );
}
