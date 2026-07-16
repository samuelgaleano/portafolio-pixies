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
      {/* gancho problema→solución INTERACTIVO (Samuel r21): muestra el problema (general y concreto)
          y al pasar el cursor / enfocar / tocar se VOLTEA y revela la solución que lo resuelve, con
          CTA oprimible al demo. Contraste: problema en signal (rojo), solución en pixel (violeta). */}
      {erpTour.demoUrl && (
        <ProblemSolution
          problemLead={erpTour.problemLead}
          problem={erpTour.problem}
          solutionLead={erpTour.solutionLead}
          solution={erpTour.solution}
          demoUrl={erpTour.demoUrl}
          ariaLabel={t.exhibit.ariaErpDemo}
        />
      )}

      {/* beneficios clave: lo que el ERP le da a una empresa, de un vistazo */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {erpTour.benefits.map((b) => (
          <div key={b.k} className="depth-card rounded-(--radius-m) p-3">
            <p className="font-display text-base font-bold text-ink">{b.k}</p>
            <p className="mt-0.5 font-mono text-[0.66rem] leading-tight text-dim">{b.v}</p>
          </div>
        ))}
      </div>

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
