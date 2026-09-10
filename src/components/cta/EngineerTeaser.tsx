import Link from 'next/link';
import { t } from '@/i18n';
import GradientText from '@/components/ui/GradientText';

// Banda-puente hacia /samuel (plan §5): la misma foto del hero acompaña también este último
// tramo antes del formulario de contacto — es el mismo ingeniero, no un mosaico placeholder.
export default function EngineerTeaser() {
  return (
    <section className="border-t border-line">
      <Link
        href="/samuel"
        data-desde="samuel"
        className="group block"
        aria-label={t.engineerTeaser.title}
      >
        <div
          data-reveal
          className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-8 px-4 py-24 sm:px-6 md:flex-row md:items-center"
        >
          <span
            className="relative block size-28 shrink-0 overflow-hidden rounded-(--radius-m) border border-line transition-transform [@media(hover:hover)]:group-hover:scale-105 sm:size-36"
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/samuel/samuel-avatar.webp"
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top"
            />
          </span>
          <div>
            <p className="font-mono text-sm text-data">{t.engineerTeaser.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl font-display text-h2 font-semibold text-ink">
              <GradientText text={t.engineerTeaser.title} em="un ingeniero" />
            </h2>
            <p className="mt-3 max-w-xl text-dim">{t.engineerTeaser.body}</p>
            <span className="mt-5 inline-block font-mono text-sm text-pixel-soft group-hover:underline">
              {t.engineerTeaser.cta}
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
