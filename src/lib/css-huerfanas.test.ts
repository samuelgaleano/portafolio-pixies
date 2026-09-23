import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

// Guardia contra una regresión que ya se coló a producción TRES veces: borrar un componente
// y llevarse por delante reglas de CSS que otros componentes seguían usando.
//
// La última (commit b13e34b, detectada el 2026-09-22 por Samuel) dejó tres cosas rotas en el
// dominio sin que ninguna prueba se quejara: el catálogo de /web sin estilos, los servicios de
// Creative sin ícono ni CTA y —lo peor— `.sig-transition.is-in` sin animación, con lo cual
// `animationend` no se disparaba nunca, `router.push('/samuel')` no llegaba a ejecutarse y
// TODOS los enlaces al ingeniero quedaron muertos. El clic no hacía absolutamente nada.
//
// La prueba busca clases que sólo pueden ser nuestras y exige que cada una tenga regla:
//   · las que llevan `__` o `--` (BEM propio; Tailwind nunca genera esos tokens)
//   · las que el JS añade con `classList.add('...')`
// Si borras un componente, borra también sus clases del código: esta prueba sólo se queja de
// clases que el código SIGUE usando y el CSS ya no define.
const RAIZ = path.resolve(__dirname, '..');
const CSS = path.join(RAIZ, 'app', 'globals.css');

// Utilidades de Tailwind que el JS añade con classList: las genera Tailwind, no globals.css.
// La lista se queda corta a propósito — si crece, es señal de que hay lógica de estilo en JS
// que debería estar en una clase propia.
const UTILIDADES_TAILWIND = new Set(['hidden']);

function archivosFuente(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir)) {
    const p = path.join(dir, entrada);
    if (statSync(p).isDirectory()) {
      if (entrada === 'node_modules' || entrada.startsWith('.')) continue;
      archivosFuente(p, acc);
    } else if (/\.tsx?$/.test(entrada) && !/\.test\.tsx?$/.test(entrada)) {
      acc.push(p);
    }
  }
  return acc;
}

/** Clases propias usadas en el código, con el archivo donde aparecen. */
function clasesUsadas(): Map<string, string> {
  const encontradas = new Map<string, string>();
  for (const archivo of archivosFuente(RAIZ)) {
    const src = readFileSync(archivo, 'utf8');
    const rel = path.relative(RAIZ, archivo).replace(/\\/g, '/');

    // className="..." / className={`...`} / className={'...'} y cualquier literal de clases
    for (const m of src.matchAll(/className\s*=\s*(?:\{)?[`'"]([^`'"]*)[`'"]/g)) {
      for (const token of m[1]!.split(/\s+/)) {
        if ((token.includes('__') || token.includes('--')) && /^[a-z][\w-]*$/i.test(token)) {
          if (!encontradas.has(token)) encontradas.set(token, rel);
        }
      }
    }
    // clases añadidas desde JS: siempre son nuestras, aunque no lleven `__`
    for (const m of src.matchAll(/classList\.(?:add|toggle)\(\s*['"]([\w-]+)['"]/g)) {
      const clase = m[1]!;
      if (UTILIDADES_TAILWIND.has(clase)) continue;
      if (!encontradas.has(clase)) encontradas.set(clase, rel);
    }
  }
  return encontradas;
}

/** ¿globals.css define una regla para esta clase? */
function tieneRegla(css: string, clase: string): boolean {
  const sinComentarios = css.replace(/\/\*[\s\S]*?\*\//g, '');
  // `.clase` seguida de lo que puede seguir a una clase en un selector: { , : espacio > + ~ .
  const re = new RegExp(`\\.${clase.replace(/[-[\]{}()*+?.\\^$|]/g, '\\$&')}(?![\\w-])[^{;]*\\{`);
  return re.test(sinComentarios);
}

describe('CSS huérfano', () => {
  const css = readFileSync(CSS, 'utf8');
  const usadas = clasesUsadas();

  it('encuentra clases propias en el código (la prueba no se quedó vacía)', () => {
    expect(usadas.size).toBeGreaterThan(40);
  });

  it('toda clase propia usada en el código tiene regla en globals.css', () => {
    const huerfanas = [...usadas]
      .filter(([clase]) => !tieneRegla(css, clase))
      .map(([clase, archivo]) => `${clase}  (${archivo})`);
    expect(huerfanas, `clases sin CSS:\n  ${huerfanas.join('\n  ')}`).toEqual([]);
  });

  it('el barrido al ingeniero tiene animación: sin ella, los enlaces a /samuel no navegan', () => {
    // EngineerTransition encadena `cubre → router.push → destapa` con `animationend`. Si
    // `.is-in` no anima, el evento no llega y la navegación NUNCA ocurre (bug de b13e34b).
    expect(css).toMatch(/\.sig-transition\.is-in\s*\{[^}]*animation:/);
    expect(css).toMatch(/\.sig-transition\.is-out\s*\{[^}]*animation:/);
    expect(css).toMatch(/@keyframes\s+sig-cubrir/);
    expect(css).toMatch(/@keyframes\s+sig-destapar/);
  });
});
