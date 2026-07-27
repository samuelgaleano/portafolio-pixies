'use client';

import { useState } from 'react';

// Credenciales de acceso de una demo, en su propio bloque justo encima del marco.
// Antes vivían dentro del párrafo de introducción y había que leerse el texto entero
// para encontrarlas; quien llega a una demo lo primero que quiere es entrar. Cada valor
// es un botón que lo copia al portapapeles, porque el paso siguiente es pegarlo en el
// formulario que está a diez centímetros más abajo.
export type Credencial = { etiqueta: string; valor: string };

export default function DemoCredentials({
  credenciales,
  nota,
}: {
  credenciales: Credencial[];
  nota?: string;
}) {
  const [copiado, setCopiado] = useState<string | null>(null);

  async function copiar(valor: string) {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(valor);
      window.setTimeout(() => setCopiado((actual) => (actual === valor ? null : actual)), 1600);
    } catch {
      // Sin permiso de portapapeles (http, iframe restringido) no pasa nada: el valor
      // está a la vista y se puede seleccionar a mano.
    }
  }

  return (
    <div className="demo-cred">
      <p className="demo-cred__intro">Entra con</p>

      <ul className="demo-cred__list">
        {credenciales.map((c) => (
          <li key={c.etiqueta}>
            <button
              type="button"
              className="demo-cred__item"
              onClick={() => copiar(c.valor)}
              aria-label={`Copiar ${c.etiqueta}: ${c.valor}`}
            >
              <span className="demo-cred__k">{c.etiqueta}</span>
              <span className="demo-cred__v">{c.valor}</span>
              <span className="demo-cred__copy" aria-hidden="true">
                {copiado === c.valor ? 'copiado' : 'copiar'}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {nota ? <p className="demo-cred__nota">{nota}</p> : null}

      <span role="status" aria-live="polite" className="sr-only">
        {copiado ? `${copiado} copiado al portapapeles` : ''}
      </span>
    </div>
  );
}
