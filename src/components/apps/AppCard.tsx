import Link from 'next/link';
import { appPath, type PixiesApp } from '@/data/apps';
import { t } from '@/i18n';
import AppLogoEscucha from './AppLogoEscucha';

// Tarjeta de una aplicación propia. RECUADRO VERTICAL, no franja horizontal (Samuel,
// 2026-09-23: "no dejar la muestra como si fuera horizontal sino un recuadro — el logo, lo
// que diga exactamente, lo que llame la atención, y ya para entrar a la aplicación").
//
// Orden de lectura, de arriba abajo: logo grande sobre placa oscura → nombre → la frase que
// engancha → qué te llevas → botón de entrar. Tarjeta entera clicable (stretched link, mismo
// patrón que ProjectCard), con el enlace real al final para que el lector de pantalla no lo
// encuentre antes que el contenido.
const LOGOS = { 'audio-a-grafo': AppLogoEscucha } as const;

export default function AppCard({ app }: { app: PixiesApp }) {
  const Logo = LOGOS[app.icon];
  return (
    <article className="app-card group">
      <div className="app-card__placa">
        <Logo className="app-card__logo" />
      </div>

      <div className="app-card__cuerpo">
        <p className="app-card__nombre">{app.nombre}</p>
        <p className="app-card__hook">{app.hook}</p>
        <p className="app-card__desc">{app.descripcion}</p>

        <ul className="app-card__capacidades">
          {app.capacidades.map((c) => (
            <li key={c} className="app-card__chip">
              {c}
            </li>
          ))}
        </ul>

        <span className="app-card__cta">
          {t.escucha.appEnterCorto}
          <span className="app-card__flecha" aria-hidden="true">
            →
          </span>
        </span>
      </div>

      <Link href={appPath(app.slug)} data-desde="apps" className="app-card__enlace">
        <span className="sr-only">
          {app.nombre} — {t.escucha.appEnterAria}
        </span>
      </Link>
    </article>
  );
}
