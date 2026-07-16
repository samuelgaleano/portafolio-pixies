'use client';

import { useId, useState } from 'react';

// Desplegable premium (pedido de Samuel: tarjetas sintetizadas, detalle bajo demanda).
// Anima la altura en ambos sentidos con el truco grid-rows 0fr→1fr (el contenido siempre
// vive en el DOM, así el cierre también anima — a diferencia de <details> nativo). Es
// accesible (aria-expanded/aria-controls) y frena la propagación para no disparar el
// enlace de la tarjeta que lo contiene. reduced-motion neutraliza la transición (global).
export default function Collapsible({
  label,
  labelOpen,
  children,
}: {
  label: string;
  labelOpen?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="relative z-[1]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="collapse-toggle"
      >
        <span>{open ? (labelOpen ?? label) : label}</span>
        <span className={`collapse-chevron${open ? ' is-open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>
      <div id={id} className={`collapse-region${open ? ' is-open' : ''}`}>
        <div className="collapse-inner">{children}</div>
      </div>
    </div>
  );
}
