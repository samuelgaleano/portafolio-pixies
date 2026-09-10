import { erpTour } from '@/data/erp-tour';
import { t } from '@/i18n';
import ErpCatalog from './ErpCatalog';

// Recorrido guiado del ERP (§12.A): contenido en erp-tour.ts.
// Rediseño (Samuel r24): el banner problema→solución quedaba justo antes del catálogo y
// sumaba un tramo narrativo más antes de llegar a lo interesante — se quita, el gancho de
// venta ya lo hace el bloque de beneficios + CTA de arriba. El catálogo pasó de grilla de
// 5 tarjetas sueltas a destacado + laterales seleccionables (ver ErpCatalog.tsx): se siente
// un tablero real, no una lista.
export default function ErpScrollytelling() {
  return (
    <div className="mt-6">
      {/* vista inicial de VENTA (Samuel r22): antes del problema/solución narrativo, lo
          primero que se ve es "esto es lo que hace" (beneficios de un vistazo) + un botón
          grande al demo. Que ver la demo tome UN clic desde arriba, no un scroll largo. */}
      <div className="erp-intro">
        <div className="erp-intro__stats">
          {erpTour.benefits.map((b) => (
            <div key={b.k} className="depth-card rounded-(--radius-m) p-3">
              <p className="font-display text-base font-bold text-ink">{b.k}</p>
              <p className="mt-0.5 font-mono text-[0.66rem] leading-tight text-dim">{b.v}</p>
            </div>
          ))}
        </div>
        {erpTour.demoUrl && (
          <a href={erpTour.demoUrl} className="erp-intro__cta press">
            <span aria-hidden="true">▶</span> Probar el ERP en vivo
          </a>
        )}
      </div>

      <ErpCatalog steps={erpTour.steps} modules={erpTour.modules} demoUrl={erpTour.demoUrl} demoAria={t.exhibit.ariaErpDemo} />
    </div>
  );
}
