'use client';

import { useState } from 'react';

// Credenciales de acceso de una demo, en su propio bloque justo encima del marco.
// El botón principal entra SOLO: rellena el formulario real dentro del iframe (mismo
// origen, por eso se puede tocar su DOM) y lo envía — quien llega a una demo lo primero
// que quiere es verla funcionando, no copiar y pegar dos veces. El detalle de usuario/
// contraseña queda debajo, visible y copiable, para quien prefiera escribirlo a mano o
// entrar con otro rol.
export type Credencial = {
  etiqueta: string;
  valor: string;
  // name/id del input real en el formulario de la demo (mismo origen). Sin esto el botón
  // de autocompletar no sabe qué campo llenar, pero copiar sigue funcionando.
  campo?: string;
};

type Estado = 'idle' | 'llenando' | 'entrando' | 'error';

function setNativeValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

export default function DemoCredentials({
  credenciales,
  nota,
}: {
  credenciales: Credencial[];
  nota?: string;
}) {
  const [copiado, setCopiado] = useState<string | null>(null);
  const [estado, setEstado] = useState<Estado>('idle');
  const autoRellenable = credenciales.some((c) => c.campo);

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

  function entrarAutomatico() {
    const iframe = document.querySelector<HTMLIFrameElement>('.demo-frame__screen iframe');
    const doc = iframe?.contentDocument;
    if (!doc) {
      setEstado('error');
      return;
    }

    let form: HTMLFormElement | null = null;
    let rellenados = 0;
    for (const c of credenciales) {
      if (!c.campo) continue;
      const input = doc.querySelector<HTMLInputElement>(`[name="${c.campo}"], #${c.campo}`);
      if (!input) continue;
      setNativeValue(input, c.valor);
      form = form ?? input.form;
      rellenados++;
    }

    // La demo puede seguir despertando (Render) y el formulario aún no existe en el DOM.
    if (rellenados === 0 || !form) {
      setEstado('error');
      window.setTimeout(() => setEstado('idle'), 2400);
      return;
    }

    setEstado('llenando');
    // Breve pausa: se alcanza a VER el formulario lleno antes de enviarlo — se siente
    // intencional, no un salto instantáneo sin explicación.
    window.setTimeout(() => {
      setEstado('entrando');
      // Clic real sobre el botón, no form.requestSubmit(): algunas demos validan el
      // origen de la petición del lado del servidor y un submit programático desde
      // fuera del iframe (aunque mismo origen) no siempre pasa esa validación — un
      // clic sobre el botón real de la demo sí es indistinguible de uno humano.
      const boton = form?.querySelector<HTMLButtonElement>('button[type="submit"], input[type="submit"]');
      if (boton) boton.click();
      else form?.requestSubmit();
    }, 450);
  }

  return (
    <div className="demo-cred">
      {autoRellenable && (
        <button
          type="button"
          className="demo-cred__auto"
          onClick={entrarAutomatico}
          disabled={estado === 'llenando' || estado === 'entrando'}
        >
          {estado === 'llenando' && 'Rellenando…'}
          {estado === 'entrando' && 'Entrando…'}
          {(estado === 'idle' || estado === 'error') && (
            <>
              <span aria-hidden="true">▶</span> Entrar automáticamente
            </>
          )}
        </button>
      )}
      {estado === 'error' && (
        <p className="demo-cred__error" role="status">
          La demo todavía está despertando — dale un par de segundos y vuelve a intentar.
        </p>
      )}

      <div className="demo-cred__manual">
        <p className="demo-cred__intro">{autoRellenable ? 'o copia los datos' : 'Entra con'}</p>

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
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        {copiado ? `${copiado} copiado al portapapeles` : ''}
      </span>
    </div>
  );
}
