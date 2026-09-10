import { erpTour } from '@/data/erp-tour';
import { t } from '@/i18n';
import ErpCatalog from './ErpCatalog';
import ProblemSolution from './ProblemSolution';

// Recorrido guiado del ERP (§12.A): contenido en erp-tour.ts.
// Rediseño (Samuel r23): la lista larga de 5 pasos idénticos (mismo bloque de texto, uno
// tras otro) se sentía monótona justo después del gancho problema→solución — la gente
// dejaba de bajar. Ahora es un catálogo: cada módulo es su propia tarjeta con su captura
// real, la primera destacada. Ver ERP: ErpCatalog.tsx.
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

      {/* gancho problema→solución INTERACTIVO (Samuel r21): muestra el problema (general y concreto)
          y al pasar el cursor / enfocar / tocar se VOLTEA y revela la solución que lo resuelve, con
          CTA oprimible al demo. Contraste: problema en signal (rojo), solución en pixel (violeta). */}
      {erpTour.demoUrl && (
        <div className="mt-6">
          <ProblemSolution
            problemLead={erpTour.problemLead}
            problemPoints={erpTour.problemPoints}
            problem={erpTour.problem}
            solutionLead={erpTour.solutionLead}
            solution={erpTour.solution}
            demoUrl={erpTour.demoUrl}
            ariaLabel={t.exhibit.ariaErpDemo}
          />
        </div>
      )}

      <ErpCatalog
        steps={erpTour.steps}
        modules={erpTour.modules}
        demoUrl={erpTour.demoUrl}
        demoAria={t.exhibit.ariaErpDemo}
      />
    </div>
  );
}
