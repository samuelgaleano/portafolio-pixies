import { apps } from '@/data/apps';
import { t } from '@/i18n';
import AppCard from './AppCard';

// Sección DIRECTA de aplicaciones propias, arriba en /web (Samuel, 2026-09-23: "ya está en la
// sección de aplicaciones y está genial, pero está muy abajo; cuando lleguen ahí ya van a
// estar un poco saturados — quiero que al inicio sea una sección directa, Aplicaciones, y
// abajo by Pixies").
//
// Mantiene `id="productos"`: el catálogo del portafolio, la ruta de la home y el enlace de
// vuelta de la página de la app ya apuntan a esa ancla, y ahora resuelven aquí arriba en vez
// de a mitad del portafolio. El portafolio deja de apilar esta categoría (`seccionPropia`).
export default function AplicacionesSection() {
  return (
    <section id="productos" className="apps-seccion scroll-mt-16">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20">
        <header data-reveal="wipe" className="apps-seccion__head">
          <h2 className="apps-seccion__titulo">{t.apps.titulo}</h2>
          <p className="apps-seccion__by">{t.apps.by}</p>
          <p className="apps-seccion__intro">{t.apps.intro}</p>
        </header>

        <div className="apps-seccion__grid">
          <div data-reveal>
            {apps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </div>

          <ul data-reveal className="apps-seccion__notas">
            {t.apps.notas.map((n) => (
              <li key={n.titulo} className="apps-seccion__nota">
                <b>{n.titulo}</b>
                <span>{n.cuerpo}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
