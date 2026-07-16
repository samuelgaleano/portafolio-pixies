import { t } from '@/i18n';

// Statement (rediseño Samuel r4 2026-07-18): ya no es una sección protagonista, sino un
// INTERSTITIAL compacto entre secciones — los 3 principios en una banda fina y sobria. Sin
// el footnote "/principios". Solo afirmaciones verificables (PRODUCT.md).
export default function Statement() {
  return (
    <section className="border-t border-line" aria-label={t.statement.label}>
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-2">
          {t.statement.lines.map((line, i) => (
            <p key={line.plain} className="flex items-baseline gap-2 text-sm text-dim">
              <span className="font-mono text-xs text-pixel-soft [font-variant-numeric:tabular-nums]">
                0{i + 1}
              </span>
              <span>
                {line.pre}
                <span className="font-medium text-pixel-soft">{line.em}</span>
                {line.post}
              </span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
