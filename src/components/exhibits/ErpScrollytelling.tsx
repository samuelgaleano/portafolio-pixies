import { erpTour } from '@/data/erp-tour';
import { t } from '@/i18n';
import Pending from '@/components/ui/Pending';
import StepTour from './StepTour';
import ProblemSolution from './ProblemSolution';

// Recorrido guiado del ERP (§12.A): contenido en erp-tour.ts, interacción en StepTour.
// Rediseño (Samuel 2026-07-18): antes del recorrido técnico, un gancho problema→solución
// que VENDE el ERP (qué duele operar sin sistema y cómo lo resuelve) + beneficios clave.
// El detalle técnico de cada paso vive ahora en un desplegable dentro de StepTour.
export default function ErpScrollytelling() {
  const hasRepo = Boolean(erpTour.repoUrl);

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

      <StepTour
        steps={erpTour.steps}
        modules={erpTour.modules}
        panelHref={erpTour.demoUrl}
        panelChip={t.exhibit.chipDemo}
        panelAria={t.exhibit.ariaErpDemo}
        footer={
          <>
            {erpTour.demoUrl && (
              <a
                href={erpTour.demoUrl}
                className="press inline-block rounded-(--radius-s) bg-signal px-4 py-2 font-mono text-xs font-medium text-void transition hover:brightness-110"
              >
                {t.exhibit.viewDemo}
              </a>
            )}
            {hasRepo ? (
              <a
                href={erpTour.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-(--radius-s) border border-line px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
              >
                {t.exhibit.viewCode}
              </a>
            ) : (
              !erpTour.demoUrl && <Pending>{t.exhibit.pendingRepo}</Pending>
            )}
          </>
        }
      />
    </div>
  );
}
