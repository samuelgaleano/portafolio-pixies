# Registro de decisiones

Decisiones tomadas durante la implementación, con su porqué. Las decisiones de arquitectura/diseño mayores están en [PLAN-MAESTRO-FASE-0.md](./PLAN-MAESTRO-FASE-0.md) §12 y §17.

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
