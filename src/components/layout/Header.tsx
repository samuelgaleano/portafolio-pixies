import Link from 'next/link';
import { t } from '@/i18n';

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-void/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between gap-2 px-4 sm:px-6"
        aria-label={t.nav.mainLabel}
      >
        <Link href="/#inicio" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <svg width="18" height="18" viewBox="0 0 32 32" aria-hidden="true">
            <rect x="0" y="0" width="14" height="14" fill="var(--color-pixel)" />
            <rect x="18" y="0" width="14" height="14" fill="var(--color-pixel)" opacity="0.45" />
            <rect x="0" y="18" width="14" height="14" fill="var(--color-pixel)" opacity="0.45" />
            <rect x="18" y="18" width="14" height="14" fill="var(--color-signal)" />
          </svg>
          pixies
        </Link>
        {/* ponytail: sin menú hamburguesa; 3 enlaces caben a 360px con el CTA corto en móvil */}
        <div className="flex items-center gap-1 text-sm sm:gap-2">
          <Link href="/#portafolio" className="whitespace-nowrap px-2 py-1.5 text-dim transition-colors hover:text-ink">
            {t.nav.portfolio}
          </Link>
          <Link href="/samuel" className="whitespace-nowrap px-2 py-1.5 text-dim transition-colors hover:text-ink">
            {t.nav.engineer}
          </Link>
          <Link
            href="/#contacto"
            data-desde="header"
            className="ml-1 rounded-(--radius-s) bg-signal px-3 py-1.5 font-medium text-void transition hover:brightness-110"
          >
            <span className="sm:hidden">{t.nav.ctaShort}</span>
            <span className="hidden sm:inline">{t.nav.cta}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
