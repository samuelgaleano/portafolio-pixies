import Link from 'next/link';

// Cierre de toda subpágina (informe, app): "volver" a su sección de la home + CTA de contacto
// que lleva el origen en data-desde (lo lee OriginTracker para el LeadForm). Un solo lugar
// para el par de botones, en vez de copiarlo en cada página.
export default function SubpageNav({
  backHref,
  backLabel,
  desde,
  ctaLabel,
}: {
  backHref: string;
  backLabel: string;
  desde: string;
  ctaLabel: string;
}) {
  return (
    <div className="mt-12 flex flex-wrap gap-3">
      <Link
        href={backHref}
        className="inline-block rounded-(--radius-s) border border-line px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
      >
        {backLabel}
      </Link>
      <Link
        href="/#contacto"
        data-desde={desde}
        className="press inline-block rounded-(--radius-s) bg-signal px-4 py-2 font-mono text-xs font-medium text-void transition hover:brightness-110"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
