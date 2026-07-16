import type { Metadata } from 'next';
import Link from 'next/link';
import DemoFrame from '@/components/demos/DemoFrame';

// Demo embebida del ERP (Sistema Integrado, dockerizado). Se sirve same-origin bajo
// /erp-demo (rewrite en next.config → contenedor), así el login por sesión funciona
// dentro del iframe. Solo estructura real + datos ficticios ("sandbox"), sin PII.
// Se muestra si el backend está configurado (NEXT_PUBLIC_ERP_DEMO=on).
const ERP_ENABLED = process.env.NEXT_PUBLIC_ERP_DEMO === 'on';

export const metadata: Metadata = {
  title: 'Demo · ERP Sistema Integrado',
  description: 'Prueba en vivo de un ERP empresarial a medida, en un entorno de demostración.',
  robots: { index: false, follow: false },
};

export default function ErpDemoPage() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pt-24 pb-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-sm text-data">/demo · sandbox · ISO 27001</p>
          <h1 className="mt-2 font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] text-ink">
            ERP Sistema Integrado — demo en vivo
          </h1>
          <p className="mt-3 max-w-2xl text-dim">
            ERP empresarial a medida (240 tablas, 39 vistas, integridad referencial fuerte y
            endurecimiento orientado a <b className="text-ink">ISO 27001</b>). Entorno de prueba con
            datos ficticios: ingresa con{' '}
            <b className="text-ink">demo@pixies.dev</b> y contraseña{' '}
            <b className="text-ink">demo1234</b> (rol administrador).
          </p>
        </div>
      </div>

      <div className="mt-6">
        {ERP_ENABLED ? (
          // same-origin (proxeado): allow-same-origin es seguro aquí, es nuestra propia demo
          <DemoFrame
            src="/erp-demo/login.php"
            title="Demo del ERP Sistema Integrado"
            label="demo/sistema-integrado"
          />
        ) : (
          <div className="rounded-(--radius-m) border border-pixel/25 bg-surface p-8 text-center sm:p-12">
            <p className="font-mono text-sm text-pixel-soft">▲ demo en preparación</p>
            <p className="mx-auto mt-3 max-w-md text-dim">
              La demo en vivo del ERP se está desplegando. Mientras tanto, con gusto te la muestro en
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
