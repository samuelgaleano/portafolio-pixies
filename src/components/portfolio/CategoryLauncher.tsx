import { categories } from '@/data/categories';
import { t } from '@/i18n';

// Launcher del portafolio (Samuel r4 2026-07-18): las 6 categorías como accesos directos que
// SALTAN a su sección (#ancla). Al pasar el cursor, cada tile revela una PREVIA (imagen) de la
// sección. Las secciones completas quedan apiladas debajo, así que igual se puede seguir
// bajando y viéndolas todas. Server component, cero JS (ancla + hover CSS).
export default function CategoryLauncher() {
  return (
    <nav aria-label={t.portfolio.navLabel} className="portfolio-launcher">
      {categories.map((c) => (
        <a key={c.id} href={`#${c.id}`} className="portfolio-tile group">
          {c.preview && (
            <span className="portfolio-tile__preview" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.preview} alt="" loading="lazy" decoding="async" />
              <span className="portfolio-tile__preview-label">◉ vista previa</span>
            </span>
          )}
          <span className="portfolio-tile__glyph" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="portfolio-tile__title">{c.title}</span>
          <span className="portfolio-tile__desc">{c.description}</span>
        </a>
      ))}
    </nav>
  );
}
