# Registro de decisiones

Decisiones tomadas durante la implementación, con su porqué. Las decisiones de arquitectura/diseño mayores están en [PLAN-MAESTRO-FASE-0.md](./PLAN-MAESTRO-FASE-0.md) §12 y §17.

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

## Evidencia de cierre Fase 1

- `astro check`: 0 errores, 0 warnings (12 archivos).
- `astro build`: 2 páginas + sitemap, sin errores.
- Lighthouse (build de producción, headless): **Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100**.
- Verificación visual en dev server: hero con animación de ensamblaje funcionando, responsive a 360px y desktop, consola sin errores ni warnings.
- Detector impeccable (45 reglas, sin LLM): 4 hallazgos → 1 corregido (bounce-easing del scroll cue), 2 falsos positivos aceptados (flat-type-hierarchy: el detector no evalúa `clamp()`, la jerarquía real va de 12px a ~144px), 1 aceptado parcialmente (em-dash: se eliminaron 2; las restantes son el byline oficial "Design Group by… — Ingeniero de Sistemas", la voz del footer y placeholders que desaparecen en F2/F5).
- ponytail-review del diff: sin sobre-ingeniería; única holgura deliberada: React instalado sin islas aún (mandato del plan, primeras islas en F3/F5).
- Pendiente de Samuel: crear repo GitHub (decisión público/privado) y conectar Cloudflare Pages (instrucciones en el resumen de cierre).
