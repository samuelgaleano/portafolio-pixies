# Spec: Hero "Píxel vivo" + auditoría rendimiento/SEO

Fecha: 2026-07-14 · Estado: aprobado por Samuel (dirección "Píxel vivo" elegida entre 3 opciones)

## Problema

El hero actual no impacta. Diagnóstico acordado:

- La animación de ensamblaje de píxeles corre una vez y muere (el canvas se desvanece a los ~1.4s).
- No hay interactividad sobre el wordmark (solo la retícula de `HeroGrid` reacciona al cursor).
- La tipografía queda corta de escala (`--text-hero: clamp(3rem, 11vw, 7rem)`), composición de "bloque de texto estándar".
- El mosaico placeholder de la foto de Samuel grita "pendiente" (no hay foto disponible; se decidió diseñar sin ella).

Además, Samuel quiere una pasada de rendimiento/SEO sobre el sitio completo.

## Diseño aprobado

### 1. Wordmark gigante

- `--text-hero` sube a escala viewport-dominante (punto de partida: `clamp(3.5rem, 14vw, 11rem)`, se afina visualmente en navegador).
- La composición se reequilibra: subtítulo mono y byline debajo, CTA con más aire. El contenedor del wordmark puede exceder el `max-w-[1200px]` si la escala lo pide.

### 2. Campo de píxeles persistente (rework de `PixelCanvas.tsx`)

La animación de ensamblaje se conserva como intro de firma, pero al terminar **el canvas no se desvanece**: los píxeles quedan vivos como representación visual del wordmark.

- **Interacción**: el cursor (pointer events; cubre touch) repele los píxeles dentro de un radio; regresan a su posición objetivo con física de resorte amortiguado.
- **Vida idle**:
  - shimmer sutil: píxeles individuales parpadean a violeta (`--color-pixel`) con baja probabilidad;
  - respiración: una onda lenta recorre el texto cada ~6s (desplazamiento vertical mínimo);
  - glitch ocasional: cada ~8–14s una banda horizontal se desplaza en X un instante (~120ms).
- **Rendimiento**:
  - un solo loop rAF; se pausa con `IntersectionObserver` cuando el hero sale de viewport (rAF ya se pausa solo con pestaña oculta);
  - canvas 2D (sin WebGL), `devicePixelRatio` cap 2;
  - celda adaptativa: en pantallas angostas la celda crece para acotar el número de partículas;
  - resize re-muestrea el texto (debounced).
- **Accesibilidad / robustez**:
  - el `h1` real queda en el DOM con opacidad 0 (permanece en el árbol de accesibilidad y como texto para SEO); el canvas es `aria-hidden` — nota: hoy usa `visibility: hidden`, que sí saca el nodo del árbol de accesibilidad; se corrige a opacidad 0;
  - `prefers-reduced-motion` o sin JS: `h1` estático visible, cero animación (comportamiento actual preservado);
  - watchdog existente se mantiene: si fuentes/canvas fallan, el `h1` aparece igual.

### 3. Composición sin vacío (`Hero.tsx`)

- Se elimina el bloque del mosaico placeholder de foto (el link a `/samuel` ya vive en el byline).
- En su lugar: chips mono con las categorías del portafolio, derivadas de `src/data/categories.ts` (única fuente de verdad), enlazando a las anclas de sus secciones. Anclan sustancia real: lo que Pixies hace.
- `HeroGrid` (retícula reactiva) se conserva tal cual.
- CTA y scroll cue se mantienen.

### 4. Auditoría rendimiento/SEO (sitio completo)

- Build de producción + revisión sobre `/`, `/samuel` y un post del blog.
- Revisar: LCP (el nuevo canvas no debe empeorarlo — el `h1` sigue siendo el elemento LCP y no se retrasa su render), CLS, tamaños de bundle, carga de fuentes, metadata/OG, JSON-LD, canonicals, sitemap/robots.
- Aplicar hallazgos P0/P1; reportar antes/después.

## Verificación

- e2e Playwright del hero actualizados: fallback reduced-motion, `h1` presente y accesible, hero sin JS, chips presentes.
- Suite completa (vitest + playwright) y build en verde.
- Verificación visual en navegador (impeccable) del resultado final.

## Fuera de alcance

- Foto real de Samuel (pendiente de asset).
- Rediseño de secciones fuera del hero (salvo fixes P0/P1 de la auditoría).
- WebGL/shaders.
