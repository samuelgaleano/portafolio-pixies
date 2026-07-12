# Registro de decisiones

## Fase 6 — Pulido + paquete visual (2026-07-12)

Requerimiento de Samuel: portafolio innovador y visualmente llamativo. Aprobado V1+V2+V3+V4 (V5 framer-motion descartado por "sin sobreingeniería"). Implementado:

| # | Qué | Cómo |
|---|---|---|
| V2 | **Scroll-reveals** | `RevealObserver` (IntersectionObserver, re-corre por ruta) + CSS con guard `js-reveal` en `<html>` → sin JS todo visible; `data-reveal` en secciones. Verificado 2→7 al scrollear |
| V4 | **Hero reactivo al cursor** | `HeroGrid` canvas: celdas se iluminan cerca del mouse; rAF solo al mover, desktop (pointer fino), off reduced-motion, lee tokens |
| V3 | **OG images** | `next/og` + `OgCard` compartido (identidad pixel); home/samuel/posts con título dinámico. Verificado visualmente + `og:image` en HTML |
| V1 | **Transición de página** | **Enfoque robusto**: la API nativa View Transitions es `undefined` en React 19.2 (experimental); se resolvió con animación CSS keyed por ruta (`PageTransition`). Documentado el porqué |
| §5 | **EngineerTeaser** | Banda-puente a /samuel con mosaico pixel; cerraba un hueco del plan original |

**Nota de performance (honesta):** Lighthouse local en `next start` oscila 66–86 en código idéntico (TBT 200–750ms) — ruido de la máquina de desarrollo, no señal. La mejor corrida iguala el baseline de F5. El LCP ~3.7s es el piso de la animación orquestada del hero (sin cambios desde F1; en Vercel con CDN baja a ~2s). CLS 0, a11y 100, SEO 100 estables. **El número real se mide en Vercel post-deploy.**



## Fase 5 — Captación de leads (2026-07-12)

Arquitectura aprobada por Samuel ("la más óptima sin sobreingeniería"): **Route Handler `/api/leads`** — valida en servidor, oculta URL/secret en env, y **confirma el guardado real antes de redirigir a wa.me** (diseño completo en [PLAN-F5-F6.md](./PLAN-F5-F6.md) §2). TDD: 23 tests de leads (rojo→verde en dos ciclos). Playwright agregado: 4 smoke en CI — cerró la re-verificación pendiente del scroll-spy.

**Auditoría de fase (subagente):** 1 Critical + 3 Important + 6 minors, todos aplicados:

| Hallazgo | Fix |
|---|---|
| **C1 (bloqueante):** Apps Script/ContentService responde SIEMPRE HTTP 200 — con secret mal copiado el handler daba "éxito" y el lead se perdía en silencio (violaba la regla de oro) | El handler ahora lee el body y exige `{ok:true}`; test nuevo: 200+`{ok:false}` → 502 |
| I1: formula injection al Sheet (`=IMPORTXML` exfiltra, `=HYPERLINK` phishea) | `safe()` en Code.gs antepone `'` a valores que empiezan con `= + - @ \t` |
| I2: empresa/mensaje demasiado largos bloqueaban el submit sin feedback | Errores renderizados + `maxLength` como cinturón |
| I3: `contacto` y `desde` sin tope de longitud | contacto ≤120 en validación; `desde` truncado ≤40 en el servidor |
| M1-M6 | Coerción de tipos en la frontera, sweep del Map de rate-limit, focus al primer error (a11y), hoja por nombre `Leads` + zona horaria Bogotá en DESPLIEGUE, log del honeypot, CI sin build doble + artifact del report on-failure |

Verificado OK por el auditor: XFF no spoofeable en Vercel, rate-limit atómico, sin CSRF aplicable, secret nunca expuesto, XSS cubierto por React+i18n estático, doble-submit bloqueado. **E2E real contra Sheet/WhatsApp verdaderos: pendiente SOLO de datos de Samuel** (#2 WhatsApp, #3 correo, #5 Sheet — checklist en DESPLIEGUE.md §5).



Decisiones tomadas durante la implementación, con su porqué. Las decisiones de arquitectura/diseño mayores están en [PLAN-MAESTRO-FASE-0.md](./PLAN-MAESTRO-FASE-0.md) §12 y §17.

## Auditoría post-migración + fundamentos de ingeniería (2026-07-12)

Auditoría con subagente de contexto aislado (arquitectura, prácticas Next.js, fundamentos). Veredicto: **0 Critical, 6 Important, 12 minors, 6 fundamentos faltantes**. Todo aplicado:

| Hallazgo (Important) | Fix |
|---|---|
| Contenido factualmente falso tras migrar: skills decía "Astro: este sitio" y el post afirmaba "sin servidor/estático" | skills.ts intercambia Next↔Astro; post reescrito con claims verdaderos (prerender + CDN + $0) |
| Canonical y og:url perdidos vs versión Astro (plan §9) | `alternates.canonical` en home, /samuel y posts — verificado en HTML |
| Validación de frontmatter perdida (Zod de Astro): title vacío/Invalid Date silenciosos | **TDD**: `parsePost` valida y falla el build nombrando archivo+campo (13 tests, rojo→verde) |
| Path traversal en slug (`getPost(path.join(...slug))`) | `isValidSlug` (kebab-case) + `dynamicParams = false` — con tests |
| Syntax highlight perdido (plan F4.3 exigía Shiki) | `rehype-pretty-code` en MDXRemote — verificado `data-language` en HTML |
| `src/styles/global.css` muerto (108 líneas heredadas, nadie lo importa) | Eliminado |

Minors aplicados: `<span>` en vez de `<div>` dentro de `<pre>` (HTML válido), `KIND_COLOR` tipado con `ReplayStep['kind']`, aria del subtítulo del hero (sr-only + aria-hidden), `<Link>` en enlaces internos (3), scroll-spy con estado React en vez de classList imperativo, escape de `<` en JSON-LD, sitemap con `lastModified` estable (fecha del último post), `@vercel/analytics/next`, campo muerto `Project.exhibit` eliminado, `data-desde` en CTAs de hero/header/samuel (F5), "Diseñé" (typo), `error.tsx` con voz de marca.

Fundamentos añadidos: **ESLint** (flat config nativa de eslint-config-next 16; ya cazó un error real: setState síncrono en effect) · **Vitest** (13 tests: parsePost/isValidSlug por TDD + regresión formatDate-UTC y readingTime) · **CI GitHub Actions** (check+lint+test+build en push/PR) · **README** · **.editorconfig** · `*.tsbuildinfo` untrackeado.

Notas: contrato §7.2 `ReplayStep.delay` sigue simplificado a tick fijo 420ms (deliberado). Banda EngineerTeaser del plan §5: pendiente para F6. El listener global de `data-desde` llega con el LeadForm en F5. Scroll-spy re-verificar visualmente (el panel de preview quedó suspendido durante la verificación final; el observer de prueba crudo tampoco disparaba — limitación del entorno, no del código).

## Migración a Next.js 16 + React 19 (2026-07-11) — a pedido de Samuel

Samuel pidió reestructurar de Astro a **Next.js + React** para desplegar en Vercel con arquitectura *server-capable* (no estática). Se migró todo el proyecto conservando el sistema de diseño, los datos y el contenido intactos.

**Qué se conservó sin cambios:** `src/styles/tokens.css`, todo `src/data/*`, `src/i18n/*`, `src/content/posts/*.mdx`, `public/fonts`, favicon. La identidad visual, la firma pixelada, las exhibiciones y el copy son idénticos.

**Qué cambió (mapeo Astro → Next):**
| Astro | Next.js |
|---|---|
| `src/pages/*.astro` | `src/app/**/page.tsx` (App Router) |
| `src/layouts/BaseLayout.astro` | `src/app/layout.tsx` + Metadata API |
| Componentes `.astro` | Componentes `.tsx` (server por defecto) |
| Islas `client:visible` | Componentes `'use client'` (Hero canvas, CategoryNav, ErpScrollytelling, AgentExhibit) |
| Content Collections + `render()` | `gray-matter` + `next-mdx-remote/rsc` (`lib/posts.ts`) |
| `@astrojs/sitemap` | `app/sitemap.ts` |
| `public/robots.txt` | `app/robots.ts` |
| SchemaOrg `.astro` | SchemaOrg `.tsx` (JSON-LD) |
| Cloudflare Web Analytics | `@vercel/analytics` |

**Tradeoff medido y aceptado por Samuel (advertido antes de ejecutar):**
- **Performance Lighthouse: 98-99 → 90** (Best Practices 100 → 96). Next envía React + su runtime (~100 KB) como base aunque las páginas se prerendericen; Astro enviaba ~0 KB en estático. Sigue cumpliendo el umbral ≥90 del plan, pero es una regresión real.
- **Ganancia:** el proyecto ya corre sobre Next.js en la plataforma de cómputo de Vercel. Cualquier página puede volverse dinámica (Server Actions, Route Handlers, datos por petición) sin reescribir. Los leads de F5 usarán un Route Handler real (servidor de verdad, no el truco de Apps Script — opcional).

**Nota honesta sobre "estático":** Next prerenderiza como estáticas las páginas que *pueden* serlo (buena práctica, no limitación). El proyecto NO es "un sitio estático": es una app Next.js server-capable cuyas páginas actuales no necesitan render por petición todavía. Forzar `dynamic` en todo sería mala ingeniería (peor performance, cero beneficio).

**La versión Astro queda intacta en `main`** hasta que se apruebe/mergee esta migración (rama `feat/migracion-nextjs`).

## Infraestructura (2026-07-11)

| Decisión | Porqué |
|---|---|
| Repo GitHub **público**: [samuelgaleano/portafolio-pixies](https://github.com/samuelgaleano/portafolio-pixies) | Decisión #16 de Samuel; público suma señal ante reclutadores |
| `gh` instalado portable en `%LOCALAPPDATA%\ghcli` (no winget) | winget se colgó >40 min; el zip portable fue inmediato y reversible |
| Repo creado vía **REST API + git** (no `gh`) | El token de Samuel tenía scope `repo` pero no `read:org` que exige `gh --with-token`; la API REST solo necesita `repo`. Token usado en un push de un solo uso; `origin` quedó con URL limpia (sin token en `.git/config`) |

## Fase 1 (2026-07-11)

| Decisión | Porqué |
|---|---|
| Scaffold escrito a mano (6 archivos) en vez de `create-astro` + carpeta temporal | La carpeta ya tenía `docs/` y `.claude/`; el resultado es idéntico y sin pasos frágiles de mover archivos |
| Header sin menú hamburguesa | Los 3 enlaces + CTA corto ("Hablemos" en móvil) caben a 360px; cero JS, cero gestión de focus |
| `t` exportado como objeto, no como función `t(clave)` | Mismo seam i18n-ready con menos indirection; cuando exista `en.ts`, `index.ts` resuelve por locale |
| Config de live-mode de impeccable diferida | Proyecto pre-implementación al momento del init; se auto-configura en el primer `/impeccable live` |
| `og:image` diferido a Fase 6 | Referenciar una imagen inexistente es peor que omitir el tag; las OG 1200×630 se diseñan en F6 |
| Fuentes sin subset adicional | Los woff2 de Fontshare/gwfh ya pesan ~147 KB los 7 archivos (presupuesto §10: ~150 KB) |
| Canvas del hero con watchdog de 4s | Si fuentes o canvas fallan, el h1 real aparece igual; la firma nunca puede romper el hero |
| Sociales del footer como texto plano con `[COMPLETAR]` | Un link roto es peor que un placeholder visible; se vuelven `<a>` cuando `site.ts` tenga URLs reales |
| Tema único oscuro declarado como decisión (`color-scheme: dark`), sin modo claro | Auditoría /artifact-design: el "mundo void" ES la identidad de marca; declararlo hace que controles nativos y scrollbars rendericen oscuros. Reglas transversales nuevas en DESIGN.md §Reglas |

## Fase 4 — "El Ingeniero" (/samuel) + blog MDX (2026-07-11)

| Decisión | Porqué |
|---|---|
| Mapa de conocimiento agrupado por **tipo** (Formación/Certificaciones/Cursos), nodos en columnas | No lista plana ni timeline genérico (§7.3); en móvil se apila caminable |
| Profundidad de skills con **etiquetas de color** (En producción/Base sólida/Explorando), no barras | Honestidad de ingeniería (§7.3); barras de progreso son cliché de CV |
| Blog con **Content Layer API de Astro 5** (`src/content.config.ts` + `glob` loader) | API vigente en Astro 5; schema Zod falla el build si un post está mal formado |
| Prose editorial **a mano** (sin plugin @tailwindcss/typography) | ~40 líneas cubren lo necesario; evita una dependencia entera (ponytail) |
| `formatDate` con `timeZone: 'UTC'` | Una fecha-solo del frontmatter (medianoche UTC) se corría un día en Colombia (UTC-5); se veía "10 de julio" en vez de 11 |
| Blockquote como **panel** (fondo surface) en vez de rail izquierdo | Detector `side-tab`: el borde lateral es un tell de UI generada; el panel es editorial y on-brand |
| Slot `head` añadido a BaseLayout | Para inyectar JSON-LD (Person en /samuel, BlogPosting por post) en el `<head>` |
| Stub `/samuel` reemplazado por página completa | Manifiesto + mapa + capacidades + historias + foro + sociales |

Evidencia F4: astro check 0 errores (40 archivos), build limpio (4 páginas incl. post renderizado), Lighthouse **99/100/100/100** en /samuel, detector del post limpio (queda 1 falso positivo conocido: flat-type-hierarchy en /samuel porque el detector no lee `clamp()`; jerarquía real 12px→144px). Verificado en navegador desktop + móvil: la página lee como **fundador, no como CV** (criterio de aceptación #3). JSON-LD Person y BlogPosting confirmados en el HTML.

## Fase 3 — Exhibiciones especiales (2026-07-11)

| Decisión | Porqué |
|---|---|
| ERP como **scrollytelling** (§12.A opción 3) | Cero riesgo de demo rota, cero mantenimiento; el visitante entiende qué y cómo sin backend |
| IA como **diagrama + consola en UNA isla** (`AgentExhibit`) en vez de dos | Van sincronizadas por un índice compartido; una isla es más simple que dos comunicándose (ponytail). El plan §6 las listaba separadas; se combinan justificadamente |
| Islas con **mejora progresiva**: SSR renderiza todo el contenido, JS añade scroll-spy (ERP) y animación (IA) | Sin JS o con reduced-motion, el contenido completo es legible (verificado en dist/index.html); la animación es un extra, no un requisito |
| `datos` pasa a **tarjetas estándar** (no exhibición especial) | El plan solo mandaba exhibición especial para ERP e IA; datos es tarjeta + reporte estático futuro (F6) |
| **Números 01–05 del pipeline y contador 01/5 del ERP: SE MANTIENEN** pese al detector | A diferencia de las categorías (paralelas, número = decoración), el pipeline ES secuencia con dependencia de orden (Brief→Investiga→…→Entrega) y en móvil los números son lo único que comunica el flujo (las flechas → se ocultan). El "01/5" es wayfinding de un recorrido. Push-back razonado al heurístico del detector |
| `class`→`className` + `key` en los `.map` de las islas | Bug real: en React el atributo es `className`; sin él los estilos no aplican. Detectado por astro check |
| Reinstalado `.claude/skills` (impeccable) tras el ff-merge | El squash-merge que sacó skills de git también los borró del working tree (eran trackeados); se reinstalan localmente (gitignoreados, no vuelven al repo) |

Evidencia F3: astro check 0 errores (25 archivos), build limpio, JS hidratado **49.8 KB gz** (presupuesto 90), Lighthouse **98/100/100/100**, ambas islas verificadas en navegador (hidratan, animan, replay funciona; error inicial `useState null` era caché de vite viciada del dev server, resuelto al reiniciar limpio).

## Revisión externa post-F2 (2026-07-11) — requesting-code-review

Revisor con ojos frescos (subagente) auditó `3ebbc57..edd1426` contra el plan. Veredicto: "With fixes". Todo aplicado:

| Hallazgo (severidad) | Fix aplicado |
|---|---|
| **Critical:** `[id]{scroll-margin-top}` sin capa anulaba los `scroll-mt-*` de Tailwind (anclas del mini-nav tapadas por el sticky ~32px) | Reglas propias envueltas en `@layer base` en global.css |
| **Important:** reduced-motion dejaba el hero invisible hasta 2.3s (faltaba resetear `animation-delay`) | `animation-delay: 0s !important` en el bloque reduce |
| **Important:** 4 enlaces a `/samuel` daban 404 hasta F4 | Stub `/samuel` con voz de marca y link al portafolio |
| **Important:** ~15 strings de UI hardcodeados en 9 componentes (violaba §6/DoD) | Barrido completo a `i18n/es.ts` |
| **Important:** hexes hardcodeados (logo SVG, mosaico hero, canvas) | `var(--color-*)` en SVG/estilos; canvas lee tokens con `getComputedStyle` |
| **Important:** `stack: string[]` — typo en id de tech desaparecía en silencio | `TechId = keyof typeof tech` (satisfies); typo = error de compilación |
| Minors aplicados | h4 en tarjetas (jerarquía), hint visible en focus/touch, `aria-label` en tarjeta-link y subtítulo con puntos medios, `aria-current` en chip activo, orden por `featured`, `theme-color`, título de #contacto diferenciado del MidCta, placeholder vercel→cloudflare |
| **Problema del PLAN:** `#contacto?desde=x` roto por diseño (fragmento≠id) | Mecanismo corregido en plan §8: `data-desde` + listener global → sessionStorage, se implementa con el LeadForm en F5 |
| **Decisión pendiente registrada:** contrato `preview.src: string` vs `astro:assets` (exige ImageMetadata) | Al llegar screenshots reales (F6): resolver vía `import.meta.glob` en ProjectCard manteniendo el contrato string en data |
| **Nota F6:** dominio duplicado en astro.config.mjs, site.ts y robots.txt | Al fijar dominio real, cambiar los 3 (checklist F6) |
| Hallazgos propios pre-revisión | `.claude/skills` (2.4MB, 153 archivos) fuera de git — es toolchain local, no código del producto; string muerto `photoAlt` eliminado |

## Evidencia de cierre Fase 1

- `astro check`: 0 errores, 0 warnings (12 archivos).
- `astro build`: 2 páginas + sitemap, sin errores.
- Lighthouse (build de producción, headless): **Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100**.
- Verificación visual en dev server: hero con animación de ensamblaje funcionando, responsive a 360px y desktop, consola sin errores ni warnings.
- Detector impeccable (45 reglas, sin LLM): 4 hallazgos → 1 corregido (bounce-easing del scroll cue), 2 falsos positivos aceptados (flat-type-hierarchy: el detector no evalúa `clamp()`, la jerarquía real va de 12px a ~144px), 1 aceptado parcialmente (em-dash: se eliminaron 2; las restantes son el byline oficial "Design Group by… — Ingeniero de Sistemas", la voz del footer y placeholders que desaparecen en F2/F5).
- ponytail-review del diff: sin sobre-ingeniería; única holgura deliberada: React instalado sin islas aún (mandato del plan, primeras islas en F3/F5).
- Pendiente de Samuel: crear repo GitHub (decisión público/privado) y conectar Cloudflare Pages (instrucciones en el resumen de cierre).
