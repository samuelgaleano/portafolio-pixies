# PLAN MAESTRO — FASE 0 (Planificación completa)
## Portafolio Pixies Digital Web Design — by Ing. Samuel Galeano

> **Estado:** ENTREGADO — Esperando la palabra **"APROBADO"** de Samuel para iniciar Fase 1.
> **Fecha de entrega:** 2026-07-08
> **Especificación fuente:** [docs/PROMPT-MAESTRO.md](./PROMPT-MAESTRO.md)
> **Regla de oro:** ninguna línea de código de implementación se escribe hasta recibir "APROBADO". Después, se implementa **fase por fase** y cada fase cierra con resumen de entregables + confirmación de Samuel antes de continuar.

### Cómo usar este documento (para la sesión futura que ejecute)
1. Leer este archivo completo antes de tocar nada.
2. Verificar la sección **§12 Decisiones abiertas**: si Samuel aprobó con ajustes, aplicarlos; si aprobó sin comentarios, ejecutar las recomendaciones marcadas ✅ RECOMENDADO.
3. Ejecutar la fase que corresponda según la **Bitácora de progreso (§14)** al final de este documento, siguiendo su checklist paso a paso.
4. Al cerrar cada fase: actualizar la bitácora (§14), hacer commit, entregar resumen y **detenerse** a esperar confirmación.

---

## ÍNDICE

1. Resumen ejecutivo
2. Stack técnico final con justificación
3. Metodologías de trabajo y desarrollo
4. Sistema de diseño (direcciones, recomendación, tokens completos)
5. Arquitectura de información (mapa del sitio)
6. Arquitectura general del proyecto (estructura de carpetas completa comentada)
7. Arquitectura específica (modelos de datos, contratos, flujos)
8. Sistema de captación de leads — diseño técnico detallado
9. SEO, Schema.org, Open Graph — plan específico
10. Accesibilidad y performance — presupuestos y checklists
11. Plan de implementación: fases 1–6 con paso a paso detallado
12. Decisiones abiertas (5.A, 5.B, 5.C) con recomendación
13. Datos y assets requeridos de Samuel
14. Bitácora de progreso (actualizar al ejecutar)
15. Riesgos y mitigaciones
16. Operación post-lanzamiento (cómo se mantiene el sitio)
17. Toolchain de skills y agentes (instalado 2026-07-08) — uso correcto por fase

---

## 1. RESUMEN EJECUTIVO

Sitio one-page con scroll narrativo (`/`) + página independiente "El Ingeniero" (`/samuel`) + blog MDX (`/samuel/posts/[slug]`). Construido con **Astro 5 + islas de React**, estilado con **Tailwind CSS v4 sobre tokens CSS propios**, desplegado en **Cloudflare Pages** desde GitHub. Captación de leads con **Google Apps Script + Google Sheets + redirección a WhatsApp** (guardado garantizado antes de redirigir). **Costo fijo mensual: $0.**

- **Dirección de diseño recomendada:** "Ensamblaje de píxeles" — lo digital como materia prima; firma visual única: el wordmark PIXIES se materializa desde píxeles en el hero, y ese lenguaje se reutiliza SOLO en 2 micro-interacciones (foto de Samuel y hover de tarjetas). Resto del sitio: sobrio y tipográfico.
- **ERP (5.A):** recorrido visual guiado (scrollytelling) — cero riesgo de demo rota. ✅
- **IA agéntica (5.B):** combinación diagrama de pipeline animado + replay de consola. ✅
- **Estructura (5.C):** se confirma one-page + `/samuel` + posts. ✅
- **6 fases de implementación**, cada una con checklist verificable y gate de aprobación.

---

## 2. STACK TÉCNICO FINAL (con justificación)

| Capa | Elección final | Justificación |
|---|---|---|
| Framework | **Astro 5** (output `static`) | El sitio es 90% contenido estático: Astro genera HTML puro con 0 KB de JS por defecto → Lighthouse Performance ≥ 90 casi garantizado. Las "islas" hidratan solo los componentes interactivos y solo cuando entran al viewport (`client:visible`). React/Vite puro obligaría a hidratar toda la página. |
| Islas interactivas | **React 18 + TypeScript** | Solo 4 islas: formulario de leads, mini-nav de portafolio (si aplica), replay de consola IA, scrollytelling ERP. React por ecosistema y porque el ERP real de Samuel probablemente es React → coherencia de skills exhibidas. |
| Estilos | **Tailwind CSS v4** (`@tailwindcss/vite`) + **tokens en CSS custom properties** (`src/styles/tokens.css`) | Tokens centralizados = una sola fuente de verdad para color/tipografía/espaciado; Tailwind consume los tokens vía `@theme`. Cambiar la paleta completa = editar 1 archivo. |
| Animaciones | **CSS nativo** (scroll-driven donde aplique, transitions, keyframes) + **Motion (framer-motion) SOLO dentro de islas que ya son React** | Presupuesto de JS estricto. La secuencia del hero se hace con CSS/vanilla (sin framework) para no hidratar el hero. `prefers-reduced-motion` respetado en el 100% de las animaciones. |
| Contenido blog | **Astro Content Collections + MDX** (`src/content/posts/*.mdx`) | Publicar = crear un `.mdx` + commit. Frontmatter tipado con Zod (falla el build si un post está mal formado → protege calidad). |
| Datos de proyectos | **`src/data/projects.ts`** tipado (TypeScript) | Criterio de aceptación #6: agregar proyecto = editar 1 archivo. Tipos estrictos evitan tarjetas rotas. |
| Hosting | **Cloudflare Pages** (plan free) | Deploy automático por push a `main`, previews por branch, SSL, CDN global, 500 builds/mes gratis (sobra). Sin funciones de servidor: todo estático. |
| Leads | **Google Apps Script Web App + Google Sheets** | $0, sin backend propio, el Sheet es la "base de datos" que Samuel ya sabe usar. Detalle en §8. |
| Analytics | **Cloudflare Web Analytics** | Gratis, sin cookies → sin banner de consentimiento, sin impacto en performance. |
| Imágenes | **`astro:assets` (`<Image/>`, `<Picture/>`)** con Sharp en build | AVIF/WebP + `srcset` + lazy loading generados en build. Thumbnails automáticos. |
| Iconos tech | **SVG inline locales** (extraídos de Simple Icons, licencia libre) | Sin peticiones externas, sin dependencia de CDNs de iconos. |
| Fuentes | **Self-hosted** `woff2` en `public/fonts/` con `@font-face` + `preload` | Sin Google Fonts en runtime (privacidad + performance + sin FOUT largo). |
| Repositorio | **GitHub** (repo público o privado, a elección de Samuel) + integración nativa Cloudflare Pages ↔ GitHub | Push a `main` = deploy a producción. Branches = preview URLs. |
| i18n | **Preparado, no implementado:** todos los strings de UI en `src/i18n/es.ts`, accedidos vía helper `t()` | Agregar inglés después = crear `en.ts` + rutas `/en/*` con `astro:i18n`. Cero refactor futuro. |

**Nota Cloudflare vs Vercel/Netlify:** se mantiene Cloudflare Pages por especificación del prompt (costo cero garantizado a perpetuidad, sin límites de ancho de banda en estáticos). No hay razón técnica para cambiar: el sitio es 100% estático.

**Versiones objetivo (fijadas al iniciar Fase 1):** Node 22 LTS local, Astro ^5, React ^18, Tailwind ^4, TypeScript ^5 estricto.

---

## 3. METODOLOGÍAS DE TRABAJO Y DESARROLLO

1. **Phase-gate con aprobación explícita.** Cada fase cierra con: build sin errores → verificación responsiva → resumen de entregables → esperar "APROBADO"/confirmación. Nunca se avanza dos fases sin gate.
2. **Mobile-first estricto.** Todo componente se diseña y verifica primero a 360 px; los breakpoints (`sm 640 / md 768 / lg 1024 / xl 1280`) solo *mejoran* el layout, nunca lo arreglan.
3. **Design-tokens-first.** Ningún color/tamaño/espaciado hardcodeado en componentes: todo sale de `tokens.css`. Regla verificable: buscar `#[0-9a-f]{6}` en `src/components` debe dar 0 resultados.
4. **Content-as-data.** Proyectos, certificados, skills, textos de UI y configuración del sitio viven en `src/data/` y `src/content/`. Los componentes son plantillas puras. Criterio: agregar proyecto/post = editar 1 archivo + commit.
5. **Islands architecture / mejora progresiva.** El sitio completo funciona sin JavaScript (navegación, contenido, enlaces, incluso el formulario tiene fallback `mailto`/WhatsApp directo). El JS solo añade: animación del hero, replay IA, scrollytelling ERP, envío AJAX del formulario.
6. **Presupuesto de performance como contrato** (detalle §10): JS hidratado total ≤ 90 KB gz; LCP móvil < 2.5 s; CLS < 0.1. Se mide al cierre de cada fase con Lighthouse (Chrome DevTools / `unlighthouse` local), no solo al final.
7. **Accesibilidad integrada, no auditada al final.** Checklist AA (§10) aplicado componente por componente al construirlo; verificación con teclado + axe DevTools al cierre de cada fase.
8. **Git disciplinado.** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`); trunk-based: `main` = producción; ramas cortas por fase (`fase-2-portafolio`) fusionadas al aprobar. Primer commit: este plan.
9. **Política de placeholders.** Todo dato real pendiente se marca `[COMPLETAR: descripción]` de forma visible y se registra en §13. Prohibido inventar datos que parezcan reales (URLs falsas, certificados falsos, métricas falsas).
10. **Definition of Done por componente:** responsivo 360→1440, navegable por teclado, contraste AA, `prefers-reduced-motion` respetado, sin colores hardcodeados, textos desde `i18n/es.ts`.
11. **Verificación end-to-end por fase:** levantar `npm run dev` + revisar en navegador real (no solo build). Fase 5 incluye prueba real de escritura en Google Sheet y redirección a WhatsApp desde móvil.
12. **Toolchain de skills instalada (§17).** El proceso se ejecuta con herramientas especializadas y jerarquía de arbitraje definida: **superpowers** gobierna el proceso (plan → ejecutar → verificar), **ponytail** gobierna el volumen de código (mínimo necesario, anti-sobre-ingeniería), **impeccable + frontend-design** gobiernan la calidad visual, y **este plan manda sobre todas** cuando hay conflicto. Detalle completo y mapa por fase en §17.

---

## 4. SISTEMA DE DISEÑO

### 4.1 Direcciones exploradas (2–3 exigidas por el prompt)

**DIRECCIÓN A — "Ensamblaje de píxeles"** ✅ RECOMENDADA
*Concepto:* Pixies construye cosas digitales; el píxel es su materia prima. El sitio escenifica ese acto de construcción **una sola vez, en grande**: al cargar, el wordmark **PIXIES** se ensambla desde píxeles dispersos que convergen a la tipografía final (secuencia orquestada de ~1.8 s, luego el sitio queda quieto y sobrio). Ese lenguaje de "materialización pixelada" reaparece **únicamente** en dos micro-interacciones: (1) la foto de Samuel en hover se "des-pixela" de mosaico grueso a foto nítida (affordance de clic), y (2) las miniaturas de proyecto revelan su preview con una transición de bloques. **Nada más en el sitio usa el efecto** — boldness concentrado.
*Por qué gana:* es literal a la marca (Pixies = píxeles) sin ser infantil; es memorable y demostrablemente técnica (se nota que está hecha a mano); es barata en JS (canvas/CSS, sin librería); y deja el resto del sitio limpio para que los proyectos hablen.

**DIRECCIÓN B — "Lienzo técnico" (alternativa clara)**
Fondo claro `#F5F6F8`, tinta `#12141C`, retícula visible tipo papel milimetrado digital, anotaciones en mono como planos de ingeniería, acento violeta. Más editorial y luminoso; se diferencia del portafolio-dev-oscuro típico. Riesgo: se acerca al cliché "layout de periódico con líneas finas" que el prompt veta; exigiría ejecución muy cuidadosa. **Fallback si Samuel prefiere fondo claro.**

**DIRECCIÓN C — "Señal y glitch controlado" (descartada)**
Estética de transmisión/señal digital: glitch sutil en hovers, scanlines, distorsión RGB en transiciones. Descartada: el glitch envejeció mal como tendencia, es difícil de mantener sobrio, y compite con la legibilidad de los proyectos (el contenido debe ganar).

### 4.2 Paleta (Dirección A) — tokens con hex

| Token | Hex | Uso |
|---|---|---|
| `--c-void` | `#0B0D12` | Fondo base (negro azulado profundo — NO negro puro) |
| `--c-surface` | `#141824` | Tarjetas, paneles, superficies elevadas |
| `--c-surface-2` | `#1C2130` | Hover de superficies, código, consola |
| `--c-line` | `#262C3D` | Bordes, retícula sutil, divisores |
| `--c-text` | `#F2F3F7` | Texto principal (contraste 15.9:1 sobre void ✔ AAA) |
| `--c-text-dim` | `#9AA3B8` | Texto secundario (contraste 7.4:1 ✔ AA) |
| `--c-pixel` | `#7C5CFF` | **Primario "Pixel Violet"**: marca, enlaces, foco, detalles de firma |
| `--c-pixel-soft` | `#A78BFF` | Variante clara del primario para texto violeta sobre oscuro (AA) |
| `--c-signal` | `#FF5D73` | **"Signal Coral"**: SOLO CTAs de conversión (leads). Texto `#0B0D12` encima |
| `--c-data` | `#5FD4F5` | **"Data Cyan"**: SOLO datos técnicos, mono, logs de consola, badges |
| `--c-ok` / `--c-err` | `#4ADE80` / `#F87171` | Estados del formulario únicamente |

Reglas de uso: violeta = identidad; coral = conversión (si todo es coral, nada convierte); cyan = capa técnica. Jamás los tres juntos en un mismo componente. Evita explícitamente los dos clichés vetados (no es negro+verde-ácido-único: la base es azulada y hay sistema de 3 acentos con roles).

### 4.3 Tipografía (todas gratuitas, self-hosted)

| Rol | Fuente | Licencia | Uso |
|---|---|---|---|
| Display | **Clash Display** (Fontshare) | ITF Free Font License | SOLO: wordmark hero, títulos de sección (h1/h2), cifras grandes. Pesos 600/700 |
| Texto | **General Sans** (Fontshare) | ITF Free Font License | Cuerpo, UI, tarjetas. Pesos 400/500/600. Empareja nativamente con Clash |
| Mono | **JetBrains Mono** (OFL) | SIL Open Font License | Bullets técnicos, stack badges, consola IA, anotaciones, fechas |

Escala tipográfica (fluida con `clamp()`): `--fs-hero: clamp(3rem, 10vw, 7.5rem)`, `--fs-h2: clamp(1.75rem, 4vw, 3rem)`, `--fs-h3: 1.25–1.5rem`, `--fs-body: 1rem/1.7`, `--fs-small: .875rem`, `--fs-mono: .8125rem`. Solo `woff2`, subset latín, `font-display: swap`, preload de las 2 críticas (Clash 700, General 400).

### 4.4 Concepto de layout

- **Contenedor** máx. 1200 px, retícula de 12 columnas en desktop / 4 en móvil, gutter 24 px.
- **Retícula visible sutil:** fondo con grid de líneas `--c-line` a baja opacidad (patrón CSS, no imagen) solo en hero y separadores de sección — eco del píxel sin ruido.
- **Espaciado:** escala base 4 px (`--sp-1: .25rem` … `--sp-24: 6rem`). Secciones separadas por `--sp-20/24` (aire generoso, ritmo editorial).
- **Radios:** `--r-s: 6px`, `--r-m: 12px`. Sin círculos decorativos; la geometría es cuadrada/pixelada por concepto.
- **Movimiento:** entrada del hero orquestada (única secuencia grande); el resto: `fade-up` sutil de 300 ms al entrar al viewport (IntersectionObserver 1 vez, CSS) y transitions de 150–200 ms en hover. Con `prefers-reduced-motion: reduce`: hero aparece estático con fade simple, todo lo demás sin animación.

### 4.5 Elemento firma (UNO, exigido por el prompt)

**La materialización pixelada**, presente exactamente en 3 lugares y ninguno más:
1. **Hero (versión grande):** canvas ligero (~4–6 KB de vanilla JS, sin librería) donde ~400 cuadrados convergen y forman "PIXIES"; termina en tipografía HTML real (el canvas se desvanece → SEO y a11y intactos: el h1 siempre existe en el DOM).
2. **Foto de Samuel:** en reposo se muestra con mosaico pixelado grueso; en hover/focus se resuelve a nítida + etiqueta "Conoce al ingeniero →". CSS puro (dos capas + transition).
3. **Tarjetas de proyecto:** el preview revela con máscara de bloques al hover (CSS `clip-path`/steps). En móvil, al entrar al viewport.

### 4.6 Voz y copy (guía)

Español directo, primera persona plural para Pixies ("Construimos…"), primera persona singular en `/samuel`. Específico y verificable: nada de "soluciones innovadoras"; sí "un ERP con 6 módulos que opera la facturación de X". Microcopy con carácter en momentos no críticos (404, footer "Hecho por Pixies — sí, este sitio también"); sobrio en el formulario (confianza).

---

## 5. ARQUITECTURA DE INFORMACIÓN (mapa del sitio)

```
/                          ← ONE-PAGE (scroll narrativo)
├── #inicio                Hero: PIXIES + subtítulo + firma Samuel + foto clickeable + CTA + scroll cue
├── #portafolio            Intro breve de la sección
│   ├── #landing           A. Landing Pages
│   ├── #catalogo          B. Catálogo / e-commerce
│   ├── #erp               C. ERP (exhibición scrollytelling — §12.A)
│   ├── #datos             D. Analítica e ingeniería de datos
│   ├── #ia                E. Sistemas agénticos de IA (diagrama + consola — §12.B)
│   └── #empresarial       F. Soluciones integrales empresariales
├── (CTA intermedio)       "¿Tienes un proyecto en mente?" → #contacto
├── (banda El Ingeniero)   Teaser con foto pixelada → /samuel
├── #contacto              Formulario de leads (sección ancla, no modal — ver §8)
└── (footer)

/samuel                    ← "EL INGENIERO" (página propia)
├── Manifiesto / presentación
├── Trayectoria y estudios (formato visual: "mapa de conocimiento" — ver Fase 4)
├── Tecnologías y capacidades por dominio
├── Proyectos: cross-links al portafolio con ángulo "cómo y por qué"
├── Foro/blog: listado de posts (fecha + lectura estimada)
└── Sociales prominentes (GitHub, LinkedIn, WhatsApp, Instagram)

/samuel/posts/[slug]       ← Post individual (layout editorial)
/404                       ← Página 404 con voz de marca
/robots.txt, /sitemap-index.xml, /favicon.svg, imágenes OG
```

Navegación: header fijo delgado con: logo Pixies (→ `#inicio`), Portafolio, El Ingeniero (→ `/samuel`), CTA "Trabajemos juntos" (→ `#contacto`, estilo `--c-signal`). En móvil: menú overlay simple. Dentro de `#portafolio`: mini-nav sticky de categorías (chips con ancla, resaltado por scroll-spy CSS/JS mínimo).

---

## 6. ARQUITECTURA GENERAL — Estructura de carpetas completa (comentada)

```
portafolio-pixies/
├── README.md                        # Guía de operación: agregar proyecto, publicar post, redesplegar Apps Script
├── package.json                     # Scripts: dev / build / preview / check (astro check + tsc)
├── astro.config.mjs                 # Integraciones: react, mdx, sitemap; site: URL producción; vite: tailwind
├── tsconfig.json                    # strict: true; paths alias @/* → src/*
├── .gitignore / .nvmrc              # node_modules, dist, .astro / Node 22
│
├── public/                          # Servido tal cual (sin procesar)
│   ├── fonts/                       # ClashDisplay-*.woff2, GeneralSans-*.woff2, JetBrainsMono-*.woff2
│   ├── favicon.svg                  # Píxel/marca P en violeta
│   ├── og/                          # Imágenes Open Graph 1200×630 (og-home.png, og-samuel.png, og-post-default.png)
│   └── robots.txt
│
├── src/
│   ├── styles/
│   │   ├── tokens.css               # ÚNICA fuente de verdad: colores, tipografía, espaciado, radios, sombras, z-index
│   │   └── global.css               # @import tailwind + tokens; reset; @font-face; utilidades firma (.pixel-reveal); reduced-motion
│   │
│   ├── i18n/
│   │   ├── es.ts                    # TODOS los strings de UI del sitio (i18n-ready; NO se implementa inglés aún)
│   │   └── index.ts                 # helper t(clave) — hoy devuelve es.ts
│   │
│   ├── data/                        # CONTENIDO COMO DATOS (editar aquí = actualizar el sitio)
│   │   ├── site.ts                  # Config global: nombre, URL, [NUMERO_SAMUEL], [CORREO_SAMUEL], sociales, URL Apps Script
│   │   ├── projects.ts              # Todos los proyectos, tipados (ver §7.1). Agregar proyecto = agregar objeto aquí
│   │   ├── categories.ts            # Definición de categorías A–F: id, título, descripción, orden, tipoProyecto del form
│   │   ├── tech.ts                  # Catálogo de tecnologías: id, nombre, icono SVG (para badges)
│   │   ├── skills.ts                # Capacidades por dominio para /samuel (ver §7.3)
│   │   ├── certifications.ts        # Estudios y certificados con enlaces verificables (ver §7.3)
│   │   ├── erp-tour.ts              # Pasos del scrollytelling del ERP: screenshot, título, anotación, capa técnica
│   │   └── agent-replays.ts         # Guiones de los replays de consola IA: pasos, logs, tiempos (ver §7.2)
│   │
│   ├── content/                     # Astro Content Collections
│   │   ├── config.ts                # Schema Zod de posts: title, description, pubDate, draft, tags
│   │   └── posts/
│   │       └── hola-mundo-pixies.mdx  # Post de ejemplo [COMPLETAR: Samuel lo reemplaza]
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro         # <html lang="es">, <Seo/>, fuentes preload, header, footer, skip-link, analytics
│   │   └── PostLayout.astro         # Layout editorial de post: prose, fecha, lectura estimada, volver a /samuel
│   │
│   ├── components/                  # Componentes .astro (estáticos, 0 JS)
│   │   ├── seo/Seo.astro            # title/description/canonical/OG/Twitter + <slot> para JSON-LD
│   │   ├── seo/SchemaOrg.astro      # Builders JSON-LD: Organization, Person, CreativeWork, BlogPosting
│   │   ├── ui/                      # Primitivas: Button.astro, Badge.astro, SectionTitle.astro, Chip.astro, Prose.astro
│   │   ├── layout/Header.astro      # Nav fijo + menú móvil (details/CSS, sin framework)
│   │   ├── layout/Footer.astro      # Marca, nav, sociales, correo, "Hecho por Pixies"
│   │   ├── hero/Hero.astro          # h1 PIXIES real en DOM + subtítulos + foto + CTA + scroll cue
│   │   ├── hero/PixelCanvas.astro   # <canvas> + script vanilla inline de la secuencia firma (no es isla React)
│   │   ├── portfolio/PortfolioSection.astro   # Orquesta categorías desde categories.ts + projects.ts
│   │   ├── portfolio/CategoryBlock.astro      # Bloque de una categoría (título, descripción, grid de tarjetas)
│   │   ├── portfolio/ProjectCard.astro        # Tarjeta patrón común (ver §7.1) — CSS hover reveal
│   │   ├── portfolio/CategoryNav.astro        # Mini-nav sticky de anclas por categoría
│   │   ├── cta/MidCta.astro         # Banda de conversión intermedia
│   │   ├── cta/EngineerTeaser.astro # Banda-puente hacia /samuel con foto pixelada
│   │   └── samuel/                  # Manifesto.astro, KnowledgeMap.astro, SkillDomains.astro,
│   │                                #   ProjectStories.astro, PostList.astro, SocialLinks.astro
│   │
│   ├── islands/                     # Islas React (ÚNICOS componentes con JS hidratado)
│   │   ├── LeadForm.tsx             # Formulario de leads completo (ver §8) — client:visible
│   │   ├── ErpScrollytelling.tsx    # Recorrido guiado del ERP (ver §12.A) — client:visible
│   │   ├── AgentReplay.tsx          # Consola replay de agentes IA (ver §12.B) — client:visible
│   │   └── PipelineDiagram.tsx      # Diagrama animado del pipeline agéntico — client:visible
│   │
│   ├── lib/
│   │   ├── leads.ts                 # Cliente del Apps Script: submitLead(), buildWhatsAppUrl(), timeout de gracia
│   │   ├── reading-time.ts          # Lectura estimada de posts
│   │   └── utils.ts                 # Helpers puros (formato fechas es-CO, etc.)
│   │
│   ├── pages/
│   │   ├── index.astro              # One-page: Hero → Portafolio → MidCta → EngineerTeaser → LeadForm → (footer en layout)
│   │   ├── samuel/index.astro       # Página El Ingeniero
│   │   ├── samuel/posts/[slug].astro  # Ruta dinámica de posts (getStaticPaths desde la colección)
│   │   └── 404.astro
│   │
│   └── env.d.ts
│
├── apps-script/                     # NO se despliega con el sitio: se copia a Google Apps Script
│   ├── Code.gs                      # Web App completa: doPost → validar → append a Sheet (ver §8)
│   └── DESPLIEGUE.md                # Instrucciones paso a paso con capturas de qué opción elegir
│
└── docs/
    ├── PROMPT-MAESTRO.md            # Especificación original (ya en repo)
    ├── PLAN-MAESTRO-FASE-0.md       # ESTE documento (plan + bitácora)
    └── DECISIONES.md                # Registro de decisiones tomadas y sus porqués (se crea en Fase 1)
```

---

## 7. ARQUITECTURA ESPECÍFICA — Modelos de datos y contratos

### 7.1 `projects.ts` — el corazón data-driven

```ts
// Tipos exactos a implementar en Fase 2 (contrato cerrado desde ya):
export type CategoryId = 'landing' | 'catalogo' | 'erp' | 'datos' | 'ia' | 'empresarial';

export interface Project {
  id: string;                    // slug único, ej. 'landing-clinica-x'
  category: CategoryId;
  name: string;
  tagline: string;               // 1–2 líneas de VALOR DE NEGOCIO, no técnicas
  bullets: string[];             // 3–5 bullets TÉCNICOS: stack exacto, arquitectura, decisiones de ingeniería
  stack: string[];               // ids de tech.ts → badges con icono
  status: 'produccion' | 'codigo';   // decide el link primario y la etiqueta visual
  liveUrl?: string;              // requerido si status === 'produccion'
  repoUrl?: string;              // requerido si status === 'codigo' (y opcional siempre)
  preview: {
    type: 'scrollshot' | 'image' | 'video';  // scrollshot = screenshot alto con scroll interno en hover
    src: string;                 // ruta en src/assets/projects/
    alt: string;
  };
  exhibit?: 'erp-tour' | 'agent-replay';  // activa exhibición especial en vez de tarjeta estándar
  featured?: boolean;            // orden preferente dentro de su categoría
}
```

**Tarjeta de proyecto (patrón común, cerrado):** preview con reveal pixelado → nombre + tagline → bullets en JetBrains Mono con marcador `▸` → badges de stack → etiqueta de estado (`● En producción` en `--c-ok` / `⌥ Ver código` en `--c-data`) → clic en toda la tarjeta abre `liveUrl` o `repoUrl` en pestaña nueva (`rel="noopener"`). Mecanismo de hover recomendado: **scrollshot** (screenshot alto del sitio real que se desplaza dentro del marco en hover, CSS `transition: object-position`); en móvil, tap expande la tarjeta (estado `expanded` CSS `:target`/checkbox, sin JS). Video loop solo si Samuel entrega el video (opt-in por proyecto).

### 7.2 `agent-replays.ts` — guion del replay de consola (islas IA)

```ts
export interface ReplayStep {
  delay: number;                 // ms desde el paso anterior
  kind: 'cmd' | 'info' | 'skill' | 'ok' | 'output';  // colorea el log (cyan/dim/violeta/verde/texto)
  text: string;                  // línea de "log" con datos DE EJEMPLO claramente marcados
}
export interface AgentReplay {
  id: string;
  projectId: string;             // vincula con projects.ts
  title: string;                 // ej. "Pipeline de contenido para marketing"
  pipeline: { stage: string; description: string }[];  // alimenta PipelineDiagram
  steps: ReplayStep[];           // alimenta AgentReplay (consola)
}
```

Comportamiento de la consola: tipeo secuencial con cursor, botón «Reproducir de nuevo», barra de etapas sincronizada con el diagrama; con `prefers-reduced-motion` se muestra el log completo estático. Todo con datos quemados: **cero llamadas a APIs, cero riesgo, siempre funciona**.

### 7.3 Datos de `/samuel`

- `skills.ts`: `{ domain: 'Web' | 'Software' | 'Datos' | 'IA' | 'Integraciones', items: { name, depth: 'produccion' | 'solido' | 'explorando', note? }[] }` — la profundidad se comunica con **etiquetas honestas de 3 niveles** ("lo uso en producción" / "base sólida" / "explorando"), no barras de progreso.
- `certifications.ts`: `{ title, institution, year, url?, kind: 'titulo' | 'certificado' | 'curso' }` — se renderiza como **mapa de conocimiento** (ver Fase 4), no lista plana.
- Cross-links de proyectos: `ProjectStories.astro` toma proyectos de `projects.ts` y les añade el campo narrativo `story` (definido en un `stories.ts` propio de /samuel: rol de Samuel, decisiones tomadas, por qué ese stack).

### 7.4 Posts (Content Collection)

```ts
// src/content/config.ts — schema Zod
posts: { title: string; description: string; pubDate: Date; tags?: string[]; draft?: boolean }
```
Ruta `/samuel/posts/[slug]`; listado en `/samuel` ordenado por fecha con lectura estimada; `draft: true` excluye del build. Un post de ejemplo con placeholder claro.

### 7.5 `site.ts` — configuración global (todos los `[COMPLETAR]` en un solo lugar)

```ts
export const site = {
  name: 'Pixies Digital Web Design',
  url: 'https://[COMPLETAR: dominio].pages.dev',
  whatsapp: '[COMPLETAR: +57...]',
  email: '[COMPLETAR: correo]',
  social: { github: '[COMPLETAR]', linkedin: '[COMPLETAR]', instagram: '[COMPLETAR]' },
  leadsEndpoint: '[COMPLETAR: URL /exec del Apps Script]',
};
```

---

## 8. SISTEMA DE CAPTACIÓN DE LEADS — Diseño técnico detallado

**Decisión de UI: sección ancla `#contacto`** (no modal). Razones: funciona sin JS, es enlazable desde WhatsApp/IG (`sitio.com/#contacto`), evita gestión de focus-trap, y el one-page narrativo desemboca naturalmente en ella. Todos los CTAs (`hero`, mid-CTA, tarjetas) son anclas a `#contacto` **con parámetro de origen**: `#contacto?desde=erp` → la isla lee el origen y **pre-selecciona el tipo de proyecto** (mapeo en `categories.ts`).

**Campos:** Nombre* · Correo o WhatsApp* (un solo campo "¿Cómo te contactamos?" que valida email O teléfono) · Empresa (opcional) · Tipo de proyecto (select pre-seleccionado por origen) · Mensaje (opcional) · honeypot oculto (`website`, invisible, si viene lleno se descarta) · validación en cliente y en Apps Script.

**Flujo de envío (contrato cerrado):**
1. `submit` → validación → estado "Guardando…".
2. `POST` al Apps Script con `mode: 'no-cors'` y body `URLSearchParams` (form-encoded) → **sin preflight CORS** (este es el truco estándar; la respuesta es opaca y no se necesita leer).
3. `Promise.race([fetchPost, timeout(2000)])`: pase lo que pase a los 2 s máximo se continúa (el fetch ya salió; Apps Script escribe aunque no leamos la respuesta).
4. Estado éxito: "Recibido ✓ — te estamos redirigiendo a WhatsApp…" → `window.location.href = wa.me/[NUMERO]?text=<mensaje formateado con nombre, tipo, mensaje>` tras ~1.2 s.
5. **Regla clave cumplida:** el guardado ocurre ANTES y NO depende de que el usuario envíe el WhatsApp.
6. Error de red real (sin conexión): mensaje honesto + correo y botón WhatsApp directo como alternativa. Fallback sin JS: la sección muestra siempre debajo del form "o escríbenos directo: [WhatsApp] · [correo]".

**Apps Script (`apps-script/Code.gs`, código completo en Fase 5):** `doPost(e)` → lee `e.parameter` → valida honeypot y campos → `LockService` (evita filas corruptas por concurrencia) → `appendRow` en el Sheet con columnas: `timestamp | nombre | contacto | empresa | tipoProyecto | mensaje | origenClick | userAgent` → responde `ContentService` JSON. `DESPLIEGUE.md` documentará: crear Sheet → Extensiones → Apps Script → pegar código → Implementar → Nueva implementación → Aplicación web → *Ejecutar como: yo* / *Acceso: cualquier persona* → copiar URL `/exec` → pegar en `site.ts` → probar con fila de prueba. Cuotas free de Apps Script: 20.000 ejecuciones/día — sobra por ~4 órdenes de magnitud.

---

## 9. SEO, SCHEMA.ORG, OPEN GRAPH — Plan específico

- **Meta por ruta:** title pattern `Pixies — Digital Web Design` / `Samuel Galeano — El ingeniero detrás de Pixies` / `<título post> — Foro de Samuel`; description única por ruta; canonical absoluto; `lang="es"`.
- **Open Graph** (crítico para compartir por WhatsApp): `og:image` 1200×630 propia por ruta (home, samuel, default de posts) diseñada con la identidad pixelada; `og:type` website/profile/article; Twitter card `summary_large_image`. Verificación en Fase 6 con opengraph.xyz + envío real por WhatsApp.
- **JSON-LD:** `Organization` (Pixies: nombre, url, logo, founder→Person, sameAs sociales) + `Person` (Samuel: jobTitle "Ingeniero de Sistemas", worksFor→Organization, sameAs) en `/` y `/samuel`; `CreativeWork` por cada proyecto (name, description, url, creator); `BlogPosting` por post (headline, datePublished, author→Person). Validación con Rich Results Test en Fase 6.
- **Sitemap:** `@astrojs/sitemap` (automático con `site` configurado) + `robots.txt` apuntándolo. Posts con `draft` excluidos.
- **Estructura semántica:** un solo `h1` por página, jerarquía h2/h3 estricta por sección, landmarks (`header/main/nav/footer`), anclas con `scroll-margin-top` (header fijo no tapa).

---

## 10. ACCESIBILIDAD Y PERFORMANCE — Presupuestos y checklists

**Presupuesto de performance (contrato):** JS hidratado total ≤ 90 KB gz (React+islas; medir con `dist/` gzip) · imagen LCP con `loading="eager"` + `fetchpriority="high"`, resto lazy · fuentes: 5 archivos woff2 subset (~150 KB total) con preload de 2 · CSS único < 40 KB gz · LCP móvil < 2.5 s, CLS < 0.1, TBT < 200 ms · Lighthouse ≥ 90 en las 4 métricas (medido en build de producción con `npm run preview`, móvil y desktop, al cierre de CADA fase).

**Checklist a11y AA (aplicado por componente):** navegación completa por teclado (probar Tab en cada fase) · `:focus-visible` con anillo `--c-pixel` de 2 px + offset · skip-link al `main` · contraste AA verificado por par de tokens (tabla en §4.2; CTAs coral llevan texto oscuro) · `alt` significativo en todo preview · formulario: `label` explícitos, `aria-invalid` + mensajes de error asociados con `aria-describedby`, estado de envío anunciado en `aria-live="polite"` · consola IA y hero: `prefers-reduced-motion` → versión estática · menú móvil y tarjetas expandibles operables con teclado · íconos decorativos `aria-hidden`.

**Matriz de QA responsivo (Fase 6 y por fase):** 360×800 (Android chico), 390×844 (iPhone), 768×1024 (tablet), 1024, 1280, 1440+. Navegadores: Chrome, Firefox, Safari iOS (vía BrowserStack alternativo: pruebas reales en el iPhone/Android de Samuel). Casos especiales: apertura desde webview de Instagram/WhatsApp (el tráfico principal), zoom 200 %, modo landscape móvil en el hero.

---

## 11. PLAN DE IMPLEMENTACIÓN — Fases con paso a paso detallado

> Cada fase lista: objetivo, pasos numerados (ejecutables en orden), entregables verificables y criterio de cierre. Los pasos asumen Windows + PowerShell/Git Bash, Node 22.

### FASE 1 — Fundaciones (proyecto base + sistema de diseño + hero + deploy)

**Objetivo:** esqueleto production-ready desplegado, con la identidad visual completa y el hero firma funcionando.

1. Verificar entorno: `node -v` (≥ 20; ideal 22). Instalar si falta.
2. Scaffold: como la carpeta ya contiene `docs/`, generar en subcarpeta temporal `npm create astro@latest tmp-scaffold -- --template minimal --typescript strict --no-git --no-install`, mover contenido a la raíz, eliminar `tmp-scaffold`.
3. `npm install` + integraciones: `npx astro add react mdx sitemap --yes` y Tailwind v4 (`npm i tailwindcss @tailwindcss/vite` + plugin en `astro.config.mjs`).
4. Configurar `tsconfig.json` (strict, alias `@/*`), `.nvmrc`, `.gitignore`, scripts `package.json` (`check`: `astro check`).
5. Descargar fuentes (Fontshare: Clash Display 600/700, General Sans 400/500/600; Google: JetBrains Mono 400/700) → convertir/obtener `woff2` subset latín → `public/fonts/`.
6. Crear `src/styles/tokens.css` (TODOS los tokens de §4.2–4.4) y `global.css` (@font-face, reset, tailwind `@theme` mapeado a tokens, utilidades `.grid-bg`, `.pixel-reveal`, bloque global `prefers-reduced-motion`).
6b. **Contexto de diseño para la toolchain (§17):** ejecutar `/impeccable init` (superficie: *brand*) y generar `PRODUCT.md` + `DESIGN.md` **derivados de §4 de este plan** (dirección "Ensamblaje de píxeles", paleta, tipografías, anti-referencias = los clichés vetados del prompt). Estos dos archivos son artefactos oficiales del repo: todo comando de diseño posterior (`/impeccable critique/audit/polish` y `frontend-design`) leerá el mismo contexto.
7. Crear `src/i18n/es.ts` + helper `t()` con los strings iniciales (nav, hero, footer).
8. Crear `src/data/site.ts` con placeholders `[COMPLETAR]` de §7.5.
9. Construir `BaseLayout.astro` (head completo, Seo.astro básico, skip-link, Header, Footer, slot).
10. Construir `Header.astro` (nav fijo + menú móvil sin JS framework) y `Footer.astro`.
11. Construir Hero completo: `Hero.astro` (h1 "PIXIES", subtítulo "Digital Web Design", línea "Design Group by Samuel Galeano — Ingeniero de Sistemas", foto placeholder con efecto pixelado CSS y link a `/samuel`, CTA "Quiero trabajar con Pixies" → `#contacto`, scroll cue) + `PixelCanvas.astro` (secuencia firma en vanilla JS inline, ~1.8 s, fallback reduced-motion).
12. Crear `index.astro` con hero + secciones placeholder vacías con anclas correctas, y `404.astro`.
13. `git init` + primer commit (`docs: plan maestro fase 0` ya incluido) + commits de fase (`feat: fundaciones y hero`).
14. Crear repo GitHub (`gh repo create` — pedir a Samuel elegir público/privado) + push.
15. Conectar Cloudflare Pages: dashboard → Workers & Pages → Create → conectar repo → framework preset Astro (`npm run build`, output `dist`) → deploy. Activar Cloudflare Web Analytics e insertar snippet en BaseLayout.
16. Verificar: `npm run build` sin errores; URL `*.pages.dev` viva; hero correcto en 360/768/1440; teclado + reduced-motion OK; Lighthouse baseline ≥ 90.

**Entregables verificables:** URL pública en Cloudflare Pages · hero firma completo y responsivo · tokens y tipografías operativos · repo GitHub con CI de deploy automático · Lighthouse ≥ 90 baseline.
**Cierre:** resumen + esperar confirmación.

### FASE 2 — Portafolio data-driven (categorías A, B, F)

**Objetivo:** sistema completo de tarjetas alimentado por `projects.ts`; agregar un proyecto nuevo = 1 objeto + screenshot.

1. Crear `tech.ts` (catálogo de badges con SVGs de Simple Icons locales: React, Next.js, Astro, Supabase, Firebase, Cloudflare, Node, Python, Tailwind, WhatsApp API, Google Sheets… ampliable).
2. Crear `categories.ts` (A–F con id, título, descripción de 1 línea, orden, `tipoProyecto` para pre-selección del form).
3. Crear `projects.ts` con el tipo `Project` (§7.1) y 1–2 proyectos placeholder por categoría A, B y F (`[COMPLETAR: ...]`, previews con imagen de ejemplo generada localmente claramente marcada como placeholder).
4. Construir `ProjectCard.astro`: patrón común completo (§7.1) — preview scrollshot con hover CSS, reveal pixelado, bullets mono, badges, etiqueta estado producción/código, tarjeta-link con `rel="noopener"`, variante expandible por tap en móvil (CSS puro).
5. Construir `CategoryBlock.astro` + `PortfolioSection.astro` (bloques secuenciales por categoría, grid responsivo 1→2→3 col).
6. Construir `CategoryNav.astro`: chips sticky con anclas + scroll-spy ligero (script inline de ~15 líneas o CSS `scroll-timeline` si el soporte alcanza).
7. Integrar en `index.astro` (A, B y F pobladas; C, D, E con bloque "próximamente" interno para Fase 3).
8. Añadir `MidCta.astro` (banda "¿Tienes un proyecto en mente?" → `#contacto?desde=general`).
9. Fase de imágenes: pipeline `astro:assets` — carpeta `src/assets/projects/`, componente de preview con `<Picture/>` AVIF/WebP, tamaños definidos.
10. Verificación de cierre: build limpio, grid responsivo en matriz completa, teclado, Lighthouse, commit + push (deploy automático).

**Entregables:** portafolio navegable con A, B, F · sistema data-driven demostrado (test: agregar proyecto dummy en vivo y borrar) · mini-nav sticky · mid-CTA.
**Cierre:** resumen + confirmación. **Aquí Samuel puede empezar a entregar datos reales de proyectos (§13) para ir reemplazando placeholders.**

### FASE 3 — Exhibiciones especiales (ERP, IA, Datos)

**Objetivo:** las tres categorías "difíciles" comunican valor técnico profundo sin backend ni riesgo.

1. **ERP (según §12.A — scrollytelling):** crear `erp-tour.ts` (5–7 pasos: screenshot + título + anotación de negocio + anotación técnica). Construir isla `ErpScrollytelling.tsx` (`client:visible`): panel sticky con el screenshot activo + pasos que avanzan con scroll (IntersectionObserver), anotaciones de arquitectura estilo "plano" en mono, CTA final al repo + badges de módulos. Fallback reduced-motion/no-JS: secuencia estática de imágenes anotadas (el contenido vive en el HTML).
2. **IA (según §12.B — diagrama + consola):** crear `agent-replays.ts` con 1 pipeline placeholder realista (`[COMPLETAR]`). Construir `PipelineDiagram.tsx` (etapas input → agente → skills → output que se iluminan por paso; SVG + Motion) y `AgentReplay.tsx` (consola con logs tipados secuenciales según §7.2, botón replay, sincronizada con el diagrama). Datos quemados, cero APIs.
3. **Datos (D):** formato recomendado — tarjeta estándar + **página de reporte estático** por proyecto de datos si Samuel entrega el material: visualizaciones exportadas como SVG/imagen del notebook real + hallazgos en texto + link al repo/notebook. Sin librerías de charts pesadas en runtime; si se necesita un gráfico vivo, SVG estático generado a mano en build.
4. Integrar C, D, E al one-page reemplazando los bloques "próximamente"; los CTAs de estas secciones llevan `#contacto?desde=erp|ia|datos`.
5. Verificación de cierre estándar (build, responsivo, teclado, reduced-motion, presupuesto JS ≤ 90 KB gz, Lighthouse) + commit/push.

**Entregables:** scrollytelling ERP funcional con placeholders · diagrama + consola IA funcionando en loop · patrón de exhibición de datos definido y montado · one-page completo de `#portafolio`.
**Cierre:** resumen + confirmación.

### FASE 4 — "El Ingeniero" (/samuel) + blog MDX

**Objetivo:** la página que convierte a Samuel en "el cerebro detrás de Pixies", jamás un CV.

1. Crear `skills.ts`, `certifications.ts`, `stories.ts` con estructura de §7.3 y placeholders.
2. Construir `/samuel/index.astro` con: **Manifiesto** (tipografía display grande, 3–4 frases con voz propia, placeholder claramente marcado) · **Mapa de conocimiento** (`KnowledgeMap.astro`): trayectoria y estudios como constelación/retícula de nodos pixelados agrupados por etapa — cada nodo un certificado/título con enlace verificable; en móvil colapsa a timeline vertical caminable. NO lista plana, NO timeline genérico de plantilla · **Dominios de capacidad** (`SkillDomains.astro`): 5 dominios con etiquetas honestas de profundidad (§7.3), layout de "planos" con anotaciones mono · **Historias de proyecto** (`ProjectStories.astro`): 3–4 proyectos cross-linkeados con el ángulo *cómo/por qué* y el rol de Samuel · **Sociales prominentes** (GitHub, LinkedIn, WhatsApp, Instagram desde `site.ts`).
3. Blog: `src/content/config.ts` (schema Zod §7.4) + post de ejemplo `hola-mundo-pixies.mdx` con contenido placeholder · `PostList.astro` en /samuel (fecha + lectura estimada vía `reading-time.ts`) · `PostLayout.astro` editorial (medida de línea ~68ch, tipografía cuidada, código con syntax highlight de Shiki nativo de Astro) · ruta `/samuel/posts/[slug].astro` con `getStaticPaths`.
4. SEO de la sección: JSON-LD `Person` en /samuel, `BlogPosting` por post, OG propia.
5. Verificación de cierre estándar + prueba específica: "¿se lee como fundador o como buscador de empleo?" — revisar copy completo contra criterio de aceptación #3.

**Entregables:** /samuel completa y navegable · sistema de posts operativo (publicar = 1 archivo .mdx + commit, demostrado) · post de ejemplo renderizado.
**Cierre:** resumen + confirmación.

### FASE 5 — Captación de leads end-to-end

**Objetivo:** ningún lead se pierde; flujo completo formulario → Sheet → WhatsApp probado en real.

1. Escribir `apps-script/Code.gs` completo (contrato §8: doPost, honeypot, LockService, appendRow, ContentService) y `apps-script/DESPLIEGUE.md` paso a paso.
2. **Acción de Samuel (guiada):** crear el Google Sheet "Leads Pixies" con la fila de encabezados, pegar el script, desplegar Web App (*Ejecutar como: yo* / *Acceso: cualquier persona*), copiar URL `/exec` → `site.ts`.
3. Construir `src/lib/leads.ts` (submitLead con `no-cors` + URLSearchParams + `Promise.race` timeout 2 s; `buildWhatsAppUrl` con mensaje formateado y `encodeURIComponent`).
4. Construir isla `LeadForm.tsx`: campos §8, validación (email O teléfono), honeypot, pre-selección por origen (`?desde=`), estados guardando/éxito/error con `aria-live`, redirección a wa.me tras éxito, fallback visible de contacto directo.
5. Conectar todos los CTAs del sitio con su parámetro de origen correcto (hero, mid-CTA, secciones C/D/E, teaser, footer).
6. **Pruebas end-to-end reales (checklist):** envío desde desktop → fila aparece en Sheet con todos los campos → redirección a WhatsApp con texto correcto · envío desde móvil real (webview de Instagram incluido) · envío con el Apps Script caído (URL rota a propósito) → mensaje de error honesto + alternativas · honeypot lleno → no escribe fila · usuario que NO envía el WhatsApp → la fila EXISTE igual (regla clave) · doble submit rápido → sin duplicados corruptos.
7. Verificación de cierre estándar + commit/push.

**Entregables:** flujo de leads 100% funcional probado contra Sheet real · Apps Script desplegado y documentado · matriz de pruebas E2E ejecutada y reportada.
**Cierre:** resumen + confirmación.

### FASE 6 — Pulido (SEO/OG/schema, a11y, performance, QA, docs)

**Objetivo:** cumplir los 8 criterios de aceptación globales con evidencia.

1. SEO final: metas únicas por ruta, canonicals, sitemap verificado, robots.txt, JSON-LD completo (§9) validado con Rich Results Test.
2. Diseñar y exportar imágenes OG (1200×630) home/samuel/posts con identidad pixelada; probar compartiendo por WhatsApp real.
3. Auditoría a11y completa: axe DevTools en todas las rutas + navegación 100% teclado + lector de pantalla básico (NVDA) en hero, portafolio y formulario + zoom 200%.
4. Auditoría de performance: Lighthouse móvil/desktop en `/`, `/samuel`, 1 post — las 4 métricas ≥ 90; revisar presupuesto JS final; `font-display` y preloads correctos; imágenes AVIF servidas.
5. QA responsivo con la matriz §10 completa + webviews IG/WhatsApp + landscape.
6. Revisión total de copy (voz §4.6, criterios #1 y #3) y de que TODOS los placeholders restantes estén marcados `[COMPLETAR]` y listados.
7. `README.md` de operación: cómo agregar un proyecto (paso a paso con ejemplo) · cómo publicar un post · cómo actualizar certificados/skills · cómo redesplegar el Apps Script · cómo cambiar textos (i18n/es.ts) · cómo se despliega (push a main).
8. `docs/DECISIONES.md` actualizado con las decisiones finales tomadas.
9. Verificación final contra los **8 criterios de aceptación globales** del prompt, uno por uno, con evidencia escrita.

**Entregables:** sitio production-ready · evidencia de los 8 criterios · documentación de operación completa.
**Cierre:** resumen final + lista definitiva de `[COMPLETAR]` pendientes de datos de Samuel.

---

## 12. DECISIONES ABIERTAS — Evaluación y recomendación (requieren tu aprobación)

### 12.A — Exhibición del ERP → ✅ RECOMENDADO: Opción 3, recorrido visual guiado (scrollytelling)

| Opción | Esfuerzo | Mantenimiento | Riesgo | Impacto |
|---|---|---|---|---|
| 1. Demo real en subdominio | Alto | **Alto y permanente** | **Crítico**: free tier dormido/roto = demo caída ante un cliente = credibilidad destruida | Alto si funciona |
| 2. Mini-demo embebida React | Medio-alto | Medio | Bajo | Alto |
| 3. Scrollytelling anotado | Medio | **Cero** | **Cero** | Alto (bien ejecutado) |

**Justificación:** el objetivo del visitante (cliente o reclutador, <30 s de atención) es *entender qué construyó Samuel y cómo* — un recorrido guiado con screenshots reales + anotaciones de arquitectura comunica eso MEJOR que una demo donde el visitante no sabe qué mirar. La opción 1 viola el principio "una demo rota daña más que ninguna demo". La opción 2 queda registrada como **mejora futura opcional** (post-lanzamiento) reutilizando la estructura de `erp-tour.ts`.

### 12.B — Exhibición de sistemas agénticos de IA → ✅ RECOMENDADO: Combinación 1 + 2 (diagrama animado + replay de consola)

**Justificación:** el diagrama responde *"¿qué hace y cómo está armado?"* (arquitectura: input → agente → skills → output, se ilumina por etapas) y la consola responde *"¿es real?"* (verosimilitud visceral de logs ejecutándose). Juntas comunican valor técnico completo con **datos quemados, cero APIs, cero mantenimiento, siempre funciona** — exactamente el criterio del prompt. La opción 3 (demo con input del visitante) añade fricción y expectativas de IA real que no podemos cumplir sin costo; la opción 4 (video) pesa, no se indexa y envejece — se acepta como complemento opcional si Samuel entrega un video corto.

### 12.C — One-page vs multi-página → ✅ RECOMENDADO: Confirmar estructura propuesta (one-page + /samuel + /samuel/posts/[slug])

**Justificación SEO/UX:** el one-page concentra autoridad en una URL fuerte para "Pixies" con anclas navegables; `/samuel` como ruta propia permite JSON-LD `Person` dedicado, OG propia para compartir su perfil, e indexación independiente de su nombre; cada post con URL propia es indexable y compartible. Único ajuste sobre la sección 4 del prompt: el formulario es **sección ancla** (no modal) por las razones de §8.

### Decisiones menores tomadas (incluidas en el plan, objetar si no gustan)
- Formulario como sección ancla, no modal (§8).
- Categorías del portafolio como **bloques secuenciales + mini-nav sticky de anclas** (no tabs/filtros JS): narrativa de scroll intacta, SEO de todo el contenido visible, 0 JS extra.
- Preview de tarjetas: mecanismo **scrollshot** por defecto; video loop opt-in por proyecto.
- Trayectoria en /samuel: formato **mapa de conocimiento** (constelación de nodos por etapa) con colapso a timeline vertical en móvil.
- Fuentes: Clash Display + General Sans + JetBrains Mono (§4.3).

---

## 13. DATOS Y ASSETS QUE DEBE ENTREGAR SAMUEL

> Nada de esto bloquea las Fases 1–4 (se avanza con placeholders `[COMPLETAR]`). Lo marcado 🔴 sí bloquea el cierre de la fase indicada.

| # | Dato | Formato | Necesario para | Bloquea |
|---|---|---|---|---|
| 1 | `[FOTO_SAMUEL]` foto profesional | JPG/PNG ≥ 1200px, fondo limpio | Hero + /samuel | Pulido F6 |
| 2 | `[NUMERO_SAMUEL]` WhatsApp | `+57XXXXXXXXXX` | Leads, sociales | 🔴 Fase 5 |
| 3 | `[CORREO_SAMUEL]` | — (¿samuel.galeano.alvis@gmail.com u otro de marca?) | Footer, fallback leads | 🔴 Fase 5 |
| 4 | URLs GitHub, LinkedIn, Instagram | URLs completas | /samuel, footer, JSON-LD | F6 |
| 5 | Google Sheet de leads | Crearlo en Fase 5 (guiado) o compartir ID | Leads | 🔴 Fase 5 |
| 6 | Dominio (opcional) | ¿`pixies.com.co`? ¿o quedará `*.pages.dev`? | site.ts, SEO, OG | F6 (decisión) |
| 7 | **Por CADA proyecto** A/B/F: nombre, URL producción y/o repo, stack real, 3–5 bullets técnicos, screenshots (ideal: screenshot completo de página para scrollshot) | Texto + imágenes | Portafolio | 🔴 datos reales para F6 |
| 8 | ERP: nombre, repo, módulos, 5–7 screenshots reales de pantallas clave, 3–5 bullets | Imágenes + texto | Scrollytelling F3 | 🔴 datos reales para F6 |
| 9 | IA: por cada sistema — qué hace, etapas del pipeline, skills, ejemplo realista de ejecución (para el guion de la consola), repo si aplica | Texto | Replay F3 | 🔴 datos reales para F6 |
| 10 | Datos (D): notebooks/reportes, gráficos exportables, repo | Archivos | F3 | datos reales para F6 |
| 11 | `[LISTA_CERTIFICADOS]`: título, institución, año, enlace verificable | Lista | /samuel F4 | datos reales para F6 |
| 12 | Estudios formales (formación de ingeniero de sistemas: universidad, años) | Texto | /samuel F4 | datos reales para F6 |
| 13 | Manifiesto/bio personal (o notas crudas: el equipo redacta y Samuel aprueba) | Texto libre | /samuel F4 | F6 |
| 14 | Primer post real del foro (o tema + notas) | Texto/MD | Blog F4 | F6 |
| 15 | Confirmar nombre del proyecto "Capa" y detalles de los 2 proyectos empresariales (TVs en red local, comunicación en red local) | Texto | Categoría F, F2 | datos reales para F6 |
| 16 | Decisión repo GitHub: ¿público o privado? (público suma señal para reclutadores) | — | Fase 1 | 🔴 Fase 1 |

---

## 14. BITÁCORA DE PROGRESO (actualizar al ejecutar)

| Fase | Estado | Fecha | Notas |
|---|---|---|---|
| Fase 0 — Planificación | ✅ ENTREGADA | 2026-07-08 | Este documento. Esperando "APROBADO" |
| Fase 0b — Toolchain de skills (§17) | ✅ INSTALADA | 2026-07-08 | superpowers + ponytail + impeccable en `.claude/skills/`; ruflo disponible sin inicializar |
| Fase 1 — Fundaciones | ✅ ENTREGADA | 2026-07-11 | Lighthouse 99/100/100/100. Repo público creado y con push: github.com/samuelgaleano/portafolio-pixies. Pendiente: conexión Cloudflare Pages |
| Fase 2 — Portafolio A/B/F | ✅ ENTREGADA | 2026-07-11 | Data-driven (projects/categories/tech). Lighthouse 99/100/100/100, detector limpio. En GitHub |
| Fase 2 — Portafolio A/B/F | ⬜ Pendiente | — | |
| Fase 3 — Exhibiciones C/D/E | ⬜ Pendiente | — | |
| Fase 4 — /samuel + blog | ⬜ Pendiente | — | |
| Fase 5 — Leads E2E | ⬜ Pendiente | — | Requiere datos #2, #3, #5 |
| Fase 6 — Pulido y cierre | ⬜ Pendiente | — | Requiere datos reales §13 |

---

## 15. RIESGOS Y MITIGACIONES

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Respuesta opaca de `no-cors` impide confirmar guardado | Media | Medio | Diseño ya lo asume: timeout de gracia + Apps Script escribe igual + prueba E2E real en F5 + fallback de contacto directo visible |
| Apps Script re-desplegado cambia la URL `/exec` | Media | Alto | Documentado en DESPLIEGUE.md: usar "Administrar implementaciones → editar" (misma URL); URL centralizada en `site.ts` |
| Screenshots pesados degradan LCP | Alta | Medio | Pipeline `astro:assets` obligatorio, AVIF/WebP, lazy salvo LCP, presupuesto por imagen < 120 KB |
| El hero canvas afecta Lighthouse móvil | Baja | Medio | Vanilla JS < 6 KB, sin bloqueo de render (defer), h1 real en DOM, fallback estático |
| Placeholders olvidados en producción | Media | Alto | Convención `[COMPLETAR:]` + grep obligatorio en cierre de F6 + tabla §13 |
| Free tier de Cloudflare cambia | Muy baja | Medio | Sitio 100% estático → portable a Netlify/GitHub Pages/Vercel en < 1 h |
| Scope creep entre fases | Media | Medio | Phase-gate estricto: lo nuevo se anota en DECISIONES.md para post-lanzamiento |

---

## 16. OPERACIÓN POST-LANZAMIENTO (resumen; detalle en README de F6)

- **Agregar proyecto:** screenshot a `src/assets/projects/` + objeto en `projects.ts` + commit → deploy automático (~2 min).
- **Publicar post:** archivo `.mdx` en `src/content/posts/` + commit.
- **Ver leads:** abrir el Google Sheet (opcional futuro: notificación por correo desde el mismo Apps Script — 5 líneas, anotado como mejora).
- **Cambiar textos/datos de contacto:** `src/i18n/es.ts` / `src/data/site.ts`.
- **Mejoras futuras registradas (no en alcance):** inglés (i18n listo), mini-demo ERP interactiva (opción 2 de 12.A), notificación de leads por email, video complementario en IA.

---

## 17. TOOLCHAIN DE SKILLS Y AGENTES (instalado 2026-07-08) — uso correcto por fase

> Instalado a petición de Samuel. Las skills de proyecto viven en `.claude/skills/` y **se cargan al inicio de cada sesión** → estarán invocables desde la próxima sesión (justo la que ejecutará la Fase 1).

### 17.1 Qué quedó instalado y cómo se invoca

| Herramienta | Qué es | Instalación realizada | Invocación |
|---|---|---|---|
| **superpowers** (obra) | Metodología completa de desarrollo: 14 skills (brainstorming, writing-plans, executing-plans, test-driven-development, systematic-debugging, verification-before-completion, code review, git worktrees…) | Skills copiadas a `.claude/skills/` (nivel proyecto) | Automática por contexto o `/brainstorming`, `/executing-plans`, `/verification-before-completion`, etc. |
| **ponytail** (DietrichGebert) | El "senior minimalista": fuerza código mínimo, mata la sobre-ingeniería (~54% menos código medido). 6 skills | Skills copiadas a `.claude/skills/` (nivel proyecto) | `/ponytail` (disciplina), `/ponytail-review` (revisa diff), `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain` |
| **impeccable** (pbakaus) | Harness de diseño frontend: 1 skill + 23 comandos + 45 reglas deterministas de detección de "diseño genérico de IA". Sucesor directo del frontend-design de Anthropic | Instalador oficial `npx impeccable install` → `.claude/skills/impeccable` (nivel proyecto). Falta `/impeccable init` (paso 6b de Fase 1) | `/impeccable <comando>`: `init`, `shape`, `craft`, `critique`, `audit`, `polish`, `bolder`, `animate`… |
| **frontend-design** (Anthropic) | Skill de generación de UI distintiva (evita estética genérica de IA) | Ya disponible como plugin (`anthropic-skills:frontend-design`) | Automática al construir UI, o invocación explícita |
| **ruflo** (ruvnet, ex claude-flow) | Meta-harness de orquestación: swarms de 98 agentes, memoria vectorial, MCP, daemon | **Verificado en npm (v3.25.4), NO inicializado — decisión deliberada (§17.4)** | Opcional: `/plugin marketplace add ruvnet/ruflo` (lite) o `npx ruflo init` (completo) |

Los repos clonados para la instalación fueron temporales (scratchpad); lo permanente es lo que está en `.claude/skills/`. Reinstalar/actualizar: `git clone` del repo → copiar `skills/` de nuevo, o `npx impeccable install` para impeccable.

### 17.2 Jerarquía de arbitraje (cuando las guías chocan)

1. **Este plan** (fases, contratos §7, presupuestos §10) manda sobre todo.
2. **ponytail** gobierna el *volumen* de código: la solución mínima que cumpla el contrato. Si superpowers/impeccable sugieren estructura extra "por si acaso", gana ponytail (YAGNI).
3. **superpowers** gobierna el *proceso*: ejecutar plan por fases, verificar antes de declarar terminado, debugging sistemático ante bugs.
4. **impeccable + frontend-design** gobiernan la *calidad visual*: pero ningún comando de diseño puede romper los presupuestos de §10 (JS ≤ 90 KB gz, Lighthouse ≥ 90) ni contradecir los tokens de §4.
5. **Economía de tokens** (restricción explícita de Samuel): no cargar frontend-design e impeccable en el mismo turno salvo creación de UI nueva mayor; preferir las verificaciones deterministas de impeccable (CLI sin LLM) donde existan; ruflo solo con autorización explícita.

### 17.3 Mapa de uso por fase (replanteamiento de la ejecución)

| Fase | Herramientas y momento exacto |
|---|---|
| **F1 Fundaciones** | `/impeccable init` tras crear tokens (paso 6b) → `PRODUCT.md` + `DESIGN.md` desde §4 · **frontend-design** al construir hero/header/footer · `/executing-plans` como marco de la fase · ponytail activo en todo el scaffold (el esqueleto mínimo que funcione) · `/verification-before-completion` antes de declarar cierre |
| **F2 Portafolio** | **frontend-design** para `ProjectCard` (el componente más visto del sitio) · `/impeccable critique` sobre el grid terminado · `/ponytail-review` del diff completo antes del commit de cierre |
| **F3 Exhibiciones** | **frontend-design** en las islas (scrollytelling, consola, diagrama) · `/impeccable animate` para que el movimiento tenga propósito (§4.4) · `/test-driven-development` para lógica pura extraíble (secuenciador del replay, pasos del tour) · `/impeccable critique` al cierre |
| **F4 /samuel + blog** | `/brainstorming` SOLO para el mapa de conocimiento (el componente sin patrón estándar) · `/impeccable shape` antes de construir la página · **frontend-design** en la construcción · `/ponytail-review` al cierre |
| **F5 Leads** | `/test-driven-development` en `leads.ts` (validación email/teléfono, honeypot, timeout, formato wa.me — es EL código crítico del negocio) · `/systematic-debugging` si las pruebas E2E fallan · `/verification-before-completion` contra la checklist E2E de la fase |
| **F6 Pulido** | `/impeccable audit` (45 reglas deterministas: a11y, performance, responsive) + `/impeccable polish` en todas las rutas · `/ponytail-audit` + `/ponytail-debt` sobre el repo completo (detectar sobre-ingeniería acumulada) · `/verification-before-completion` contra los **8 criterios de aceptación globales** |
| **Todas** | Cierre de fase ampliado: build limpio + responsivo + Lighthouse + `/impeccable audit` + `/ponytail-review` + `/verification-before-completion` → recién entonces resumen y gate de aprobación |

### 17.4 Ruflo — decisión: disponible pero NO inicializado (requiere tu OK para activarlo)

**Razones técnicas de no ejecutar `npx ruflo init` ahora:**
1. Su init escribe `CLAUDE.md`, hooks, daemon y servidor MCP propios que **inyectan contexto en cada sesión y multiplican el consumo de tokens** — va directamente contra tu restricción principal.
2. Su valor (swarms de ~98 agentes coordinados, memoria federada) está dimensionado para proyectos grandes multi-equipo; este sitio estático con 6 fases secuenciales y gates de aprobación no tiene trabajo paralelo suficiente para amortizarlo.
3. Su `CLAUDE.md` competiría con este plan como fuente de verdad del proceso (conflicto con §17.2 regla 1).

**Cuándo SÍ tendría sentido (activación dirigida, con tu autorización):** si en Fase 2–3 decidieras paralelizar la generación de muchas tarjetas/islas a la vez, o para proyectos futuros de Pixies de mayor escala. Activación: `/plugin marketplace add ruvnet/ruflo` (modo lite, cero archivos en el workspace) o `npx ruflo init` (harness completo). Mientras tanto, la necesidad de paralelismo puntual se cubre con la skill `dispatching-parallel-agents` de superpowers (ya instalada) y los subagentes nativos de Claude Code.

### 17.5 Cambios netos que esta toolchain introduce al plan original

- **Nuevo paso 6b en Fase 1** (`/impeccable init` + `PRODUCT.md`/`DESIGN.md` como artefactos del repo derivados de §4).
- **Definición de cierre de fase ampliada** (§17.3 fila "Todas"): se añaden `/impeccable audit`, `/ponytail-review` y `/verification-before-completion` al criterio de cierre de §11.
- **TDD obligatorio en el código crítico de negocio** (`leads.ts`, Fase 5) y en lógica pura de islas (Fase 3) — antes era verificación manual.
- **Metodología #12 añadida en §3** (jerarquía de arbitraje).
- El resto del plan (stack, diseño, arquitectura, contratos, fases, decisiones §12) **no cambia**: las herramientas refuerzan su ejecución, no lo reemplazan.

---

> **PRÓXIMO PASO — de Samuel:** responder **"APROBADO"** (con o sin ajustes a §12 y §17) + decisión #16 (repo público/privado). Con eso, la siguiente sesión ejecuta la Fase 1 completa siguiendo §11 + §17 sin necesidad de re-planificar nada. Las skills instaladas en `.claude/skills/` se cargarán automáticamente en esa sesión.
