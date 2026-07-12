'use client';

import { useEffect } from 'react';

// Listener global del origen del clic (plan §8 corregido): cualquier elemento con
// data-desde guarda su valor en sessionStorage; LeadForm lo lee para pre-seleccionar.
// Vive en el layout para cubrir clics en cualquier página (ej. /samuel → /#contacto).
export default function OriginTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-desde]');
      if (el?.dataset.desde) sessionStorage.setItem('pixies-desde', el.dataset.desde);
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
