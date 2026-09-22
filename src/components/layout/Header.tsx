import Link from 'next/link';
import { t } from '@/i18n';
import DivisionSelector from './DivisionSelector';
import DivisionCta from './DivisionCta';
import DivisionSufijo from './DivisionSufijo';

// Header del grupo (mockup 15-final-ajustado.html → producción, Samuel 2026-09-21):
//   [logo del GRUPO + sufijo de la división activa] [ver como: Creative | Web | Grupo] [CTA de la división]
// "Ingeniero" ya no es un enlace de primer nivel: el ingeniero es el respaldo de la división
// Web (vive en el hero y el teaser de /web y en el pie), igual que el equipo de tres es el
// respaldo de Creative. Sin menú hamburguesa: en móvil el selector baja a una segunda fila.
export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-void/80 backdrop-blur-md">
      <nav className="header-grid mx-auto w-full max-w-[1200px] px-4 sm:px-6" aria-label={t.nav.mainLabel}>
        <Link href="/" className="logo-grupo flex min-h-11 items-center gap-2 font-display text-lg font-bold tracking-tight">
          {/* marca 2×2: dos celdas toman el color de la división activa (--acento) */}
          <span className="logo-mk" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>
            p
            {/* firma de marca: la "i" se desarma en píxeles cada tanto y vuelve —
                eco minúsculo del wordmark del hero, en el sitio donde el logo vive siempre */}
            <span className="logo-i">
              <span className="logo-i__glyph">i</span>
              <span className="logo-i__bits" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            </span>
            xies
          </span>
          <DivisionSufijo />
          {/* sin aria-label en el enlace (Lighthouse: el nombre accesible debe contener el
              texto visible, y el sufijo cambia por ruta); el destino va en sr-only */}
          <span className="sr-only"> — inicio</span>
        </Link>

        <DivisionSelector />

        <DivisionCta />
      </nav>
    </header>
  );
}
