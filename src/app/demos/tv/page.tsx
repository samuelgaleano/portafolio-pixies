import type { Metadata } from 'next';
import Link from 'next/link';
import DemoFrame from '@/components/demos/DemoFrame';

// Demo embebida del sistema de señalización de TVs (Node + Socket.io). A diferencia
// del POS, se embebe con un iframe DIRECTO al origen de la demo (no proxy): la app usa
// WebSockets, que un rewrite de Next no proxea bien, y no tiene login/cookies, así que
// un iframe cross-origin funciona sin problema. La URL viene de NEXT_PUBLIC_TV_DEMO_URL.
// El panel de control del TV vive en /admin/ (la raíz no sirve nada). NEXT_PUBLIC_TV_DEMO_URL
// es el origen del servicio (local o Render); aquí apuntamos al panel.
const TV_ORIGIN = process.env.NEXT_PUBLIC_TV_DEMO_URL || '';
const TV_URL = TV_ORIGIN ? `${TV_ORIGIN.replace(/\/+$/, '')}/admin/` : '';

export const metadata: Metadata = {
  title: 'Demo · Sincronización de TVs',
  description: 'Panel de control en vivo del sistema de señalización digital en red local.',
  robots: { index: false, follow: false },
};

export default function TvDemoPage() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pt-24 pb-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-sm text-data">/demo · sandbox</p>
          <h1 className="mt-2 font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] text-ink">
            Señalización digital — demo en vivo
          </h1>
          <p className="mt-3 max-w-2xl text-dim">
            Panel de control real: sube y reordena imágenes y velas sincronizarse en tiempo real por
            WebSockets. El control físico de televisores (Wake-on-LAN / Samsung) no alcanza hardware desde
            la nube; el resto del sistema es plenamente funcional.
          </p>
        </div>
        <a
          href="https://github.com/samuelgaleano/sincronizacion-tv-red-local"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-mono text-sm text-pixel-soft hover:underline"
        >
          Ver el código →
        </a>
      </div>

      <div className="mt-6">
        {TV_URL ? (
          <DemoFrame
            src={TV_URL}
            title="Demo del sistema de señalización de televisores"
            label="demo/senalizacion-tv"
          />
        ) : (
          <div className="rounded-(--radius-m) border border-pixel/25 bg-surface p-8 text-center sm:p-12">
            <p className="font-mono text-sm text-pixel-soft">▲ demo en preparación</p>
            <p className="mx-auto mt-3 max-w-md text-dim">
              El panel en vivo de señalización se está desplegando. Mientras tanto, con gusto te lo
              muestro en directo — escríbeme y lo vemos.
            </p>
            <Link
              href="/#contacto"
              className="press mt-5 inline-block rounded-(--radius-s) bg-signal px-5 py-2.5 font-mono text-xs font-medium text-void transition hover:brightness-110"
            >
              Hablemos →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
