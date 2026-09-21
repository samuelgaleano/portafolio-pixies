import { t } from '@/i18n';
import DivisionGlyph from './DivisionGlyph';

// Bifurcación Pixies Design Group (grupo-y-marketing, 2026-09): los dos "capítulos" de
// la empresa madre, con la gramática espacial que pidió Samuel — Marketing ancla y entra
// desde la IZQUIERDA, Web desde la DERECHA, la nota de unificación queda al CENTRO. Sigue
// el mismo patrón de MidCta.tsx/Hero.tsx (server component, `data-reveal` + RevealObserver
// existente); nada de JS nuevo para el movimiento. Primera porción real de la landing del
// grupo — el resto (contenido completo de /web y /marketing) es un paso aparte, ver
// docs/grupo-y-marketing/02-plan-de-trabajo.md §Sprint 3a.
export default function GrupoSplit() {
  const { split } = t;

  return (
    <section className="border-y border-line" aria-labelledby="grupo-split-h">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6">
        <h2 id="grupo-split-h" className="sr-only">
          Elige tu división
        </h2>

        <p className="mb-10 max-w-[34ch] font-display text-h2 font-semibold text-ink">
          {split.bridgePre}
          <a href={split.marketing.href} className="grupo-bridge grupo-bridge--marketing">
            {split.bridgeMk}
          </a>
          {split.bridgeMid}
          <a href={split.web.href} className="grupo-bridge grupo-bridge--web">
            {split.bridgeWeb}
          </a>
          {split.bridgePost}
        </p>

        <div className="grupo-split">
          <a
            href={split.marketing.href}
            data-desde="grupo-split-marketing"
            data-reveal="left"
            className="grupo-cap grupo-cap--marketing"
          >
            <span className="grupo-cap__num">{split.marketing.capNum}</span>
            <DivisionGlyph letra="M" variant="marketing" className="grupo-cap__glyph" />
            <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-bold text-balance">{split.marketing.title}</h3>
            <p className="max-w-[34ch] text-[1.1rem]">{split.marketing.que}</p>
            <p className="grupo-cap__quien">{split.marketing.quien}</p>
            <div className="grupo-cap__chips" aria-hidden="true">
              <span className="grupo-cap__chip">
                <b>{split.marketing.chip1n}</b>
                <span>{split.marketing.chip1t}</span>
              </span>
              <span className="grupo-cap__chip">
                <b>{split.marketing.chip2n}</b>
                <span>{split.marketing.chip2t}</span>
              </span>
            </div>
            <span className="grupo-cap__cta press rounded-(--radius-s) px-4 py-2.5 font-medium">{split.marketing.cta}</span>
          </a>

          <a
            href={split.web.href}
            data-desde="grupo-split-web"
            data-reveal="right"
            className="grupo-cap grupo-cap--web"
          >
            <span className="grupo-cap__num">{split.web.capNum}</span>
            <DivisionGlyph letra="W" variant="web" className="grupo-cap__glyph" />
            <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-bold text-balance">{split.web.title}</h3>
            <p className="max-w-[34ch] text-[1.1rem]">{split.web.que}</p>
            <p className="grupo-cap__quien">{split.web.quien}</p>
            <div className="grupo-cap__chips" aria-hidden="true">
              <span className="grupo-cap__chip">
                <b>{split.web.chip1n}</b>
                <span>{split.web.chip1t}</span>
              </span>
              <span className="grupo-cap__chip">
                <b>{split.web.chip2n}</b>
                <span>{split.web.chip2t}</span>
              </span>
            </div>
            <span className="grupo-cap__cta press rounded-(--radius-s) px-4 py-2.5 font-medium">{split.web.cta}</span>
          </a>
        </div>

        <p data-reveal className="grupo-union mt-10 font-mono text-sm text-dim">
          {split.union}
        </p>
      </div>
    </section>
  );
}
