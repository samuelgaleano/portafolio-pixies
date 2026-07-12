import Link from 'next/link';
import { t } from '@/i18n';

// Banda-puente hacia /samuel (plan §5). Reutiliza el mosaico pixelado de la foto placeholder
// como firma; refuerza el posicionamiento "el cerebro detrás de Pixies".
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
          className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-8 px-4 py-20 sm:px-6 md:flex-row md:items-center"
        >
          {/* mosaico pixelado — mismo lenguaje que la foto del hero */}
          <span
            className="block size-28 shrink-0 rounded-(--radius-m) border border-line transition-transform group-hover:scale-105 sm:size-36"
            style={{
              // solo violeta: signal se reserva a conversión (regla propia del DESIGN — critique P2)
              backgroundImage:
                'conic-gradient(var(--color-surface-2) 25%, var(--color-line) 0 50%, var(--color-surface-2) 0 75%, var(--color-line) 0), linear-gradient(color-mix(in srgb, var(--color-pixel) 26%, transparent), color-mix(in srgb, var(--color-pixel) 10%, transparent))',
              backgroundSize: '18px 18px, 100% 100%',
            }}
            aria-hidden="true"
          />
          <div>
            <p className="font-mono text-sm text-data">{t.engineerTeaser.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl font-display text-h2 font-semibold text-ink">
              {t.engineerTeaser.title}
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
