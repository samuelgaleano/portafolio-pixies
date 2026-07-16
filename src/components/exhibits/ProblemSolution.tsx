'use client';

import { useState } from 'react';
import Link from 'next/link';
import { t } from '@/i18n';

// Gancho problema→solución INTERACTIVO (Samuel r21): muestra el PROBLEMA (general y concreto) y,
// al pasar el cursor / enfocar / tocar, la tarjeta se VOLTEA (flip 3D) y aparece la SOLUCIÓN que
// resuelve ese dolor, con el CTA al demo. Reusable (ERP y POS). Contraste de marca: problema en
// signal (rojo), solución en pixel (violeta). El flip por hover es puro CSS; el estado is-flipped
// (clic/tap) lo maneja este componente para que también funcione en móvil sin depender del hover.
interface ProblemSolutionProps {
  problemLead: string;
  problem: string;
  solutionLead: string;
  solution: string;
  demoUrl: string;
  ariaLabel: string; // describe a dónde lleva la solución (p. ej. "Abrir la demo del ERP")
}

export default function ProblemSolution({
  problemLead,
  problem,
  solutionLead,
  solution,
  demoUrl,
  ariaLabel,
}: ProblemSolutionProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="ps">
      <div className={`ps-inner${flipped ? ' is-flipped' : ''}`}>
        {/* CARA PROBLEMA — al tocar (móvil) voltea; en desktop el hover ya revela la solución */}
        <button
          type="button"
          className="ps-face ps-face--problem"
          aria-label={`${t.exhibit.erpProblem}: ${problemLead}. ${t.exhibit.psHint}`}
          onClick={() => setFlipped(true)}
        >
          <span className="ps-label ps-label--problem">
            <span aria-hidden="true">⚠</span> {t.exhibit.erpProblem}
          </span>
          <p className="ps-lead">{problemLead}</p>
          <p className="ps-text">{problem}</p>
          <span className="ps-hint" aria-hidden="true">
            {t.exhibit.psHint}
          </span>
        </button>

        {/* CARA SOLUCIÓN — enlace al demo (oprimible hacia el demo, Samuel r20) */}
        <Link href={demoUrl} className="ps-face ps-face--solution" aria-label={ariaLabel}>
          <span className="ps-label ps-label--solution">
            <span aria-hidden="true">✦</span> {t.exhibit.erpSolution}
          </span>
          <p className="ps-lead">{solutionLead}</p>
          <p className="ps-text">{solution}</p>
          {/* valor añadido (Samuel r21): además del sistema, software a la medida del problema real */}
          <p className="ps-plus">
            <span className="ps-plus__mark" aria-hidden="true">✦</span>
            <span>
              Y además, te construimos un <b>software a la medida</b> de tu problema específico.
            </span>
          </p>
          <span className="ps-cta">
            <span aria-hidden="true">▶</span> {t.exhibit.viewDemo}
          </span>
        </Link>
      </div>
    </div>
  );
}
