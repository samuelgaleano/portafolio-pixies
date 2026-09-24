import Link from 'next/link';
import { appPath, type PixiesApp } from '@/data/apps';
import { t } from '@/i18n';
import AppLogoEscucha from './AppLogoEscucha';

// Ficha de aplicación en formato TIENDA (Samuel, 2026-09-23: "un recuadro tipo App Store, que
// se pueda escoger, visual, enfocado a las descargas").
//
// La gramática es la de una tienda: ícono + nombre + quién la hace + categoría, botón de
// descarga arriba, ficha técnica, una vista previa de lo que vas a ver, y las capacidades
// como etiquetas. Lo que NO se copia de una tienda son las estrellas ni el número de
// descargas: no los tenemos, y un rating inventado es exactamente el tipo de dato que en
// este sitio no se pone. En su lugar, la "reseña" es el argumento real — de dónde viene la
// app y contra qué compite — que vive en `t.apps.notas`, al lado de la tarjeta.
const LOGOS = { 'audio-a-grafo': AppLogoEscucha } as const;

export default function AppCard({ app }: { app: PixiesApp }) {
  const Logo = LOGOS[app.icon];
  const { ficha } = app;
  const href = appPath(app.slug);

  return (
    <article className="app-ficha">
      <header className="app-ficha__head">
        <span className="app-ficha__placa">
          <Logo className="app-ficha__logo" />
        </span>
        <span className="app-ficha__id">
          <h3 className="app-ficha__nombre">{app.nombre}</h3>
          <p className="app-ficha__dev">{ficha.desarrollador}</p>
          <p className="app-ficha__cat">
            {ficha.categoria} · {ficha.plataforma}
          </p>
        </span>
      </header>

      <p className="app-ficha__hook">{app.hook}</p>

      <div className="app-ficha__acciones">
        <Link href={href} data-desde="apps" className="app-ficha__btn app-ficha__btn--primario">
          {t.apps.btnDescargar}
        </Link>
        <Link href={href} data-desde="apps-probar" className="app-ficha__btn">
          {t.apps.btnProbar}
        </Link>
      </div>

      {/* vista previa: lo que de verdad vas a ver al entrar — la ventana de la app con su
          panel lateral y el grafo. Dibujada, no una captura: así nunca queda desactualizada */}
      <div className="app-ficha__vista" aria-hidden="true">
        <span className="app-ficha__vista-barra">
          <i />
          <i />
          <i />
        </span>
        <span className="app-ficha__vista-cuerpo">
          <span className="app-ficha__vista-lateral">
            <i />
            <i />
            <i />
          </span>
          <svg viewBox="0 0 120 70" className="app-ficha__vista-grafo">
            <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5">
              <path d="M60 36 L30 18" />
              <path d="M60 36 L96 22" />
              <path d="M60 36 L40 58" />
              <path d="M60 36 L92 54" />
            </g>
            <circle cx="60" cy="36" r="6" fill="#7c5cff" />
            <circle cx="30" cy="18" r="4" fill="#35c9e8" />
            <circle cx="96" cy="22" r="4" fill="#f5b400" />
            <circle cx="40" cy="58" r="4" fill="#7c5cff" />
            <circle cx="92" cy="54" r="4" fill="#35c9e8" />
          </svg>
        </span>
      </div>
      <p className="app-ficha__vista-pie">{t.apps.vistaPie}</p>

      <ul className="app-ficha__capacidades">
        {app.capacidades.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <dl className="app-ficha__meta">
        <div>
          <dt>{t.apps.metaVersion}</dt>
          <dd>{ficha.version}</dd>
        </div>
        <div>
          <dt>{t.apps.metaFormato}</dt>
          <dd>{ficha.formato}</dd>
        </div>
        <div>
          <dt>{t.apps.metaPrecio}</dt>
          <dd>{ficha.precio}</dd>
        </div>
      </dl>
    </article>
  );
}
