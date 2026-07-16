import type { Metadata } from 'next';
import Link from 'next/link';
import DemoFrame from '@/components/demos/DemoFrame';

// Demo embebida del sistema POS (dockerizado). El POS se sirve same-origin bajo
// /pos-demo (rewrite en next.config → contenedor), así el login por sesión funciona
// dentro del iframe. Entorno de prueba con datos ficticios ("sandbox").
// Solo se muestra el iframe si el backend está configurado (NEXT_PUBLIC_POS_DEMO=on);
// si no, se evita un iframe roto en despliegues sin la demo conectada.
const POS_ENABLED = process.env.NEXT_PUBLIC_POS_DEMO === 'on';

export const metadata: Metadata = {
  title: 'Demo · Sistema POS',
  description: 'Prueba en vivo del sistema POS para restaurantes, en un entorno de demostración.',
  robots: { index: false, follow: false },
};

export default function PosDemoPage() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pt-24 pb-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-sm text-data">/demo · sandbox</p>
          <h1 className="mt-2 font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] text-ink">
            Sistema POS — demo en vivo
          </h1>
          <p className="mt-3 max-w-2xl text-dim">
            Entorno de prueba con datos ficticios. Ingresa con usuario{' '}
            <b className="text-ink">admin</b> y contraseña <b className="text-ink">password</b> (también{' '}
            <span className="font-mono text-sm">cajero1</span> o{' '}
            <span className="font-mono text-sm">mesero1</span>). Los datos son de demostración.
          </p>
        </div>
        <a
          href="https://github.com/samuelgaleano/sistema-pos-restaurante"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-mono text-sm text-pixel-soft hover:underline"
        >
          Ver el código →
        </a>
      </div>

      <div className="mt-6">
        {POS_ENABLED ? (
          // same-origin (proxeado): allow-same-origin es seguro aquí, es nuestra propia demo
          <DemoFrame
            src="/pos-demo/"
            title="Demo del sistema POS para restaurantes"
            label="demo/sistema-pos"
          />
        ) : (
          <div className="rounded-(--radius-m) border border-pixel/25 bg-surface p-8 text-center sm:p-12">
            <p className="font-mono text-sm text-pixel-soft">▲ demo en preparación</p>
            <p className="mx-auto mt-3 max-w-md text-dim">
              La demo en vivo del POS se está desplegando. Mientras tanto, con gusto te la muestro en
              directo — escríbeme y la vemos.
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
