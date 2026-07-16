import { t } from '@/i18n';

// Banda de conversión intermedia (§4.3). data-desde alimenta la pre-selección del lead form:
// en F5 un listener global guarda el origen en sessionStorage al hacer clic (ver DECISIONES.md).
export default function MidCta() {
  return (
    <section className="border-y border-line">
      <div
        data-reveal
        className="grid-bg mx-auto flex w-full max-w-[1200px] flex-col items-start gap-6 px-4 py-24 sm:px-6 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 className="font-display text-h2 font-semibold text-ink">{t.midCta.title}</h2>
          <p className="mt-2 max-w-md text-dim">{t.midCta.body}</p>
        </div>
        <a
          href="#contacto"
          data-desde="general"
          className="shrink-0 rounded-(--radius-s) press bg-signal px-6 py-3 font-semibold text-void transition hover:brightness-110"
        >
          {t.midCta.cta}
        </a>
      </div>
    </section>
  );
}
