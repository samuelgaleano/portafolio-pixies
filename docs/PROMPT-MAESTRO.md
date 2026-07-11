# PROMPT MAESTRO — Portafolio Pixies Digital Web Design
### Designed by Ing. Samuel Galeano
**Versión 1.0 — Documento de especificación para Claude Code**

---

## ⚠️ INSTRUCCIÓN DE FLUJO DE TRABAJO (LEER PRIMERO)

Este proyecto se ejecuta en **DOS FASES OBLIGATORIAS**:

**FASE 0 — PLANIFICACIÓN (tu primera respuesta):** NO escribas código todavía. Tu primera entrega debe ser únicamente:
1. Arquitectura general del proyecto (estructura de carpetas completa comentada).
2. Stack técnico final propuesto con justificación de cada elección.
3. Sistema de diseño propuesto (paleta con hex, tipografías, concepto de layout, elemento distintivo/firma visual).
4. Plan de implementación dividido en fases numeradas (Fase 1, 1b, 2, etc.), cada una con entregables verificables.
5. Decisiones abiertas que requieren mi aprobación, incluyendo tu recomendación para cada una (ver sección "Decisiones a evaluar").
6. Lista de todos los assets y datos que necesitas de mí (URLs, repos, textos, fotos, certificados).

**FASE 1+ — IMPLEMENTACIÓN:** Solo procedes a escribir código después de que yo apruebe explícitamente el plan con la palabra "APROBADO". Implementas fase por fase, y al final de cada fase haces un resumen de lo entregado y esperas confirmación antes de continuar.

---

## 1. CONTEXTO Y OBJETIVO

Eres un equipo senior compuesto por: arquitecto de software, ingeniero frontend avanzado, diseñador UX/UI de estudio boutique, e ingeniero de datos. Vas a construir el **portafolio web oficial de Pixies Digital Web Design**, la empresa del Ing. Samuel Galeano (ingeniero de sistemas, Colombia).

Este sitio cumple **doble propósito estratégico**:

1. **Carta de presentación de la empresa Pixies** ante clientes potenciales: dar credibilidad mediante proyectos reales ya ejecutados (desarrollo web, software, integraciones de IA, integraciones empresariales, CRM/ERP, analítica de datos).
2. **Huella digital profesional del Ing. Samuel Galeano** ante empresas/reclutadores: evidenciar conocimiento, proyectos, estudios y tecnologías — pero **NUNCA con estética de hoja de vida**. Debe leerse como "el cerebro detrás de una empresa consolidada y de proyectos exitosos", no como alguien buscando empleo. El posicionamiento es: *la fortaleza de Pixies es el conocimiento profundo de este ingeniero*.

**Tono de marca:** disruptivo, creativo, técnicamente impecable, visualmente memorable. El sitio en sí mismo es la primera prueba de la calidad del trabajo de Pixies: si el portafolio no impresiona, nada de lo que contiene importa.

---

## 2. STACK TÉCNICO (COSTO FIJO CERO — OBLIGATORIO)

Restricción dura: **cero costos fijos mensuales**. Stack propuesto (puedes proponer ajustes justificados en Fase 0, pero sin romper la restricción de costo):

| Capa | Tecnología | Notas |
|---|---|---|
| Frontend | **Astro + islas de React** (o React/Vite si lo justificas mejor) | Astro da rendimiento superior para un sitio mayormente estático con componentes interactivos puntuales |
| Estilos | Tailwind CSS + CSS custom para el sistema de diseño | Tokens de diseño centralizados |
| Animaciones | CSS nativo + Motion (framer-motion) solo en islas que lo requieran | Respetar `prefers-reduced-motion` |
| Hosting | **Cloudflare Pages** | Deploy automático desde GitHub, SSL, CDN global gratis |
| Captación de leads | **Google Apps Script (Web App) + Google Sheets** | Sin backend propio. Detalle en sección 6 |
| Contenido del blog/foro | Archivos **Markdown/MDX en el repo** | Samuel publica haciendo commit de un .md; sin CMS, sin base de datos |
| Analytics | Cloudflare Web Analytics (gratis, sin cookies) | |
| Repositorio | GitHub, deploy vía integración Cloudflare Pages ↔ GitHub | |

**Requisitos no funcionales obligatorios:**
- 100% responsivo (mobile-first; gran parte del tráfico desde WhatsApp/Instagram será móvil).
- Lighthouse ≥ 90 en Performance, Accessibility, Best Practices y SEO.
- SEO completo: meta tags, Open Graph (para que se vea bien al compartir por WhatsApp), sitemap, schema.org (`Person` + `Organization` + `CreativeWork` por proyecto).
- Accesibilidad: navegación por teclado, focus visible, contraste AA.
- Idioma principal: **español** (dejar arquitectura preparada para agregar inglés después con i18n, pero NO implementarlo aún).
- Imágenes optimizadas (formatos modernos, lazy loading, thumbnails generados en build).

---

## 3. DIRECCIÓN DE DISEÑO

En Fase 0 debes proponer un sistema de diseño **específico para esta marca**, no una plantilla genérica. Reglas:

- **Evita los clichés de diseño generado por IA:** fondo crema con serif y acento terracota; fondo negro con un solo acento verde ácido; layout tipo periódico con líneas finas. Si propones algo cercano a eso, debe ser una decisión justificada por la marca, no un default.
- La palabra "Pixies" y el concepto "digital web design" son material creativo: explóralo (píxeles, retícula, glitch controlado, construcción progresiva, lo digital como materia prima). Propón 2–3 direcciones y recomienda una.
- **Un solo elemento firma:** elige UNA cosa memorable (el hero, una micro-interacción, un sistema de retícula, un tratamiento tipográfico) y ejecuta el resto con disciplina y sobriedad. Boldness concentrado, no decoración dispersa.
- Tipografía con carácter: una display distintiva usada con moderación + una de texto legible + opcionalmente una mono para datos técnicos/código (encaja con la marca de ingeniería).
- El movimiento debe tener propósito: una secuencia de entrada orquestada en el hero > efectos dispersos por todo el sitio.
- Copy en español, directo, específico y con voz propia. Nada de relleno tipo "soluciones innovadoras para un mundo digital".

---

## 4. ARQUITECTURA DE INFORMACIÓN Y SECCIONES

El sitio es principalmente **one-page con scroll narrativo** + rutas independientes para la sección personal de Samuel y para cada post del foro/blog. Estructura:

### 4.1 HERO — Identidad
- Al cargar: aparece grande **"Pixies"** con el subtítulo **"Digital Web Design"** (definir jerarquía exacta en la propuesta de diseño).
- Debajo o al lado: **"Design Group by Samuel Galeano — Ingeniero de Sistemas"**.
- En una esquina/posición integrada: **foto del ingeniero** (placeholder `[FOTO_SAMUEL]`) con affordance clara de que es clickeable (hover con micro-interacción). Al hacer clic → navega a la sección/página **"El Ingeniero"** (4.4).
- CTA secundario visible: **"Quiero trabajar con Pixies"** → ancla al formulario de leads (4.5).
- Indicador de scroll para continuar hacia el portafolio.

### 4.2 PORTAFOLIO — Proyectos por categoría
Sección dividida en subcategorías navegables (tabs, filtros o bloques secuenciales — proponer en Fase 0). Cada **tarjeta de proyecto** tiene un patrón común:

- **Miniatura/preview visual** del proyecto. En hover (desktop) la miniatura se amplía o se activa (scroll interno del screenshot, video corto en loop, o zoom — proponer el mecanismo). En móvil, tap muestra el estado expandido.
- **Título + descripción corta** (1–2 líneas de valor de negocio).
- **Bullets técnicos** dirigidos a un lector técnico/reclutador: stack exacto (ej. Next.js, Supabase, Cloudflare Workers, Firebase, WhatsApp Business API…), arquitectura resumida, y 1–2 decisiones de ingeniería relevantes. Máximo 4–5 bullets, específicos y verificables.
- **Badges de tecnologías** (iconos pequeños).
- **Acción al clic:**
  - Si el proyecto está desplegado en producción → abre el sitio en vivo (nueva pestaña).
  - Si NO está desplegado → abre el repositorio de GitHub.
  - Distinguir visualmente ambos casos (ej. etiqueta "En producción" vs "Ver código").

**Categorías (cada una con sus proyectos placeholder que yo llenaré con URLs/repos reales):**

**A. Landing Pages**
- Proyectos: `[LANDING_1: nombre, URL_live, repo, stack, bullets]`, `[LANDING_2...]`.
- Patrón: preview interactivo → clic → sitio en vivo.

**B. Páginas web tipo catálogo / e-commerce**
- Ej.: catálogo tipo Shopify con integración a base de datos.
- Proyectos: `[CATALOGO_1: nombre, URL_o_repo, stack (ej. React + Supabase), bullets]`.

**C. Sistema ERP**
- Proyecto grande y específico. **Ver "Decisiones a evaluar" (sección 5.A):** demo en vivo vs mini-demo embebida con datos quemados vs redirección al repo.
- Placeholder: `[ERP: nombre, repo, stack, módulos principales, bullets]`.

**D. Analítica e ingeniería de datos**
- Proyectos de análisis de datos. Formato de exhibición: notebook/reporte estático, dashboard con datos quemados, o visualizaciones interactivas ligeras embebidas (proponer).
- Placeholder: `[DATA_1...]`.

**E. Implementaciones de IA (sistemas agénticos)**
- Sistemas agénticos con skills que ejecutan procesos estructurados (ej. pipelines de contenido para marketing). **Ver "Decisiones a evaluar" (sección 5.B)** para el mecanismo de exhibición.
- Placeholder: `[IA_1: nombre, qué hace, arquitectura, repo_si_aplica]`.

**F. Soluciones integrales empresariales**
- Ej.: sistema de sincronización de televisores en red local (transmisión simultánea del mismo contenido); sistema de comunicación en red local (proyecto "Capa" / `[CONFIRMAR_NOMBRE]`).
- Formato: tarjeta con diagrama/visual básico + bullets técnicos + clic → GitHub.
- Placeholder: `[EMPRESARIAL_1...]`, `[EMPRESARIAL_2...]`.

### 4.3 CTA INTERMEDIO
Entre portafolio y sección personal: banda de conversión ("¿Tienes un proyecto en mente?") → ancla al formulario de leads.

### 4.4 "EL INGENIERO" — Samuel Galeano (ruta propia, ej. `/samuel`)
Página independiente, enlazada desde la foto del hero y desde el nav. **Concepto:** biografía interactiva y disruptiva — "el cerebro detrás de Pixies" — con toda la información de una hoja de vida pero sin parecer una. Contiene:

1. **Presentación/manifiesto** personal breve y con voz propia.
2. **Trayectoria y estudios:** formación, certificados (`[LISTA_CERTIFICADOS]` con enlaces verificables cuando existan), presentados de forma visual (timeline interactivo, mapa de conocimiento, o el formato que propongas — NO una lista plana).
3. **Tecnologías y capacidades:** agrupadas por dominio (desarrollo web, software, datos, IA, integraciones empresariales), con nivel de profundidad honesto. Formato visual propio, no barras de progreso genéricas.
4. **Proyectos:** referencias cruzadas a los proyectos del portafolio con el ángulo de *cómo* y *por qué* se construyeron (el rol de Samuel, las decisiones que tomó).
5. **Foro/blog personal:** posts escritos por Samuel (pensamientos sobre IA y cómo le ha servido, el mundo laboral actual, emprender en el campo tech, etc.). Implementación: archivos MDX en el repo, listado con fecha y lectura estimada, ruta por post (`/samuel/posts/slug`). Diseño editorial cuidado. Incluir 1 post de ejemplo con contenido placeholder que yo reemplazaré.
6. **Enlaces sociales** prominentes y clicables: GitHub `[URL]`, LinkedIn `[URL]`, WhatsApp `[NUMERO]`, Instagram `[URL]`.

### 4.5 CAPTACIÓN DE LEADS — Formulario + WhatsApp
Ver detalle técnico completo en sección 6.

### 4.6 FOOTER
Marca, navegación, sociales, correo `[CORREO_SAMUEL]`, "Hecho por Pixies" (meta-referencia: este sitio también es un proyecto de Pixies).

---

## 5. DECISIONES A EVALUAR (responder en FASE 0 con recomendación)

**A. Exhibición del ERP.** Evalúa y recomienda entre:
1. Desplegar una **demo real** del ERP en un subdominio (solo si cabe en free tier: Cloudflare Pages/Workers + Firebase Spark o Supabase free) con usuario demo de solo lectura y datos quemados.
2. **Mini-demo embebida** dentro del portafolio: versión recortada del ERP (2–3 pantallas clave funcionales) como isla React con datos quemados en JSON, sin backend.
3. **Recorrido visual guiado:** carrusel/scrollytelling de pantallas reales del ERP con anotaciones de arquitectura + botón al repo.
Considera: esfuerzo, mantenimiento, riesgo de que una demo rota dañe la credibilidad, e impacto en el visitante. Recomienda una y justifica.

**B. Exhibición de los sistemas agénticos de IA.** El reto: son procesos backend (agentes con skills que ejecutan pipelines estructurados) con frontend mínimo. No basta mostrarlos como catálogo; el visitante debe *entender qué hacen*. Evalúa y recomienda entre (o combina):
1. **Diagrama de arquitectura animado/interactivo:** el flujo del pipeline se anima paso a paso (input → agente → skills → output) al hacer scroll o clic, con explicación por etapa.
2. **Replay tipo terminal/consola:** simulación visual del agente ejecutando el proceso (logs estilizados apareciendo secuencialmente con datos de ejemplo), como un "video" hecho en código — ligero, controlado, siempre funciona.
3. **Demo interactiva contenida:** el visitante da un input mínimo y ve el proceso simulado con datos quemados (sin llamadas reales a APIs).
4. **Video/GIF corto** del sistema real funcionando, embebido y optimizado.
Recomienda el formato (o combinación: ej. diagrama animado + replay de consola) que mejor comunique valor técnico sin costo de mantenimiento.

**C. One-page vs multi-página.** Confirma o ajusta la propuesta de la sección 4 (one-page + `/samuel` + posts) según SEO y UX.

---

## 6. SISTEMA DE CAPTACIÓN DE LEADS (especificación completa)

**Flujo del usuario:**
1. El visitante hace clic en cualquier CTA ("Quiero trabajar con Pixies", "Estoy interesado", "Quiero más información") desde el hero, el CTA intermedio, o una tarjeta/sección de proyecto.
2. Se abre el **formulario** (modal o sección ancla — proponer). Campos:
   - Nombre* 
   - Correo o teléfono/WhatsApp* (al menos uno)
   - Empresa (opcional)
   - Tipo de proyecto de interés (select: Landing page / Catálogo-ecommerce / ERP-software a medida / Analítica de datos / IA / Integraciones empresariales / Otro) — **pre-seleccionado automáticamente según la sección desde la que hizo clic**.
   - Mensaje breve (opcional)
3. Al enviar:
   - **Paso 1 (crítico, siempre):** el lead se guarda vía `fetch POST` a un **Google Apps Script desplegado como Web App**, que escribe una fila en un **Google Sheet** con: timestamp, nombre, contacto, empresa, tipo de proyecto, mensaje, **sección de origen del clic**, y user-agent/dispositivo. Manejar CORS correctamente (truco estándar: `no-cors` + payload como form-encoded, o doGet/doPost con ContentService). Incluir el código completo del Apps Script en la entrega, con instrucciones de despliegue paso a paso.
   - **Paso 2:** tras confirmación de guardado (o timeout de gracia de ~2s para no bloquear al usuario), redirigir a **WhatsApp** con mensaje prellenado vía `https://wa.me/[NUMERO_SAMUEL]?text=...` que incluya la información del formulario formateada (nombre, tipo de proyecto, mensaje). 
   - **Regla clave:** el lead queda guardado en el Sheet **aunque el usuario nunca envíe el mensaje de WhatsApp**. El guardado ocurre antes de la redirección, no depende de ella.
4. Estado de éxito visible en la UI ("Recibido — te estamos redirigiendo a WhatsApp") y manejo de error honesto con alternativa (mostrar correo y WhatsApp directos si el guardado falla).

**Anti-spam:** honeypot field + validación básica. Sin captcha de terceros (fricción).

---

## 7. DATOS QUE SAMUEL ENTREGARÁ (placeholders a solicitar en Fase 0)

- `[FOTO_SAMUEL]` — foto profesional.
- `[NUMERO_SAMUEL]` — WhatsApp con indicativo (+57...).
- `[CORREO_SAMUEL]`.
- URLs: GitHub, LinkedIn, Instagram.
- Por cada proyecto: nombre, URL en producción (si existe), repo de GitHub, stack real, 3–5 bullets técnicos, screenshots/video.
- Lista de estudios y certificados con enlaces.
- Textos: manifiesto personal, bio, primer post del foro.
- ID del Google Sheet de leads (o instrucción para crearlo).

**Mientras no existan los datos reales:** usa placeholders claramente marcados (`[COMPLETAR: ...]`) y contenido de ejemplo realista, NUNCA datos inventados que parezcan reales.

---

## 8. PLAN DE FASES SUGERIDO (ajústalo en tu propuesta)

- **Fase 1:** Fundaciones — proyecto base, sistema de diseño implementado (tokens, tipografía, componentes base), hero completo, layout responsivo, deploy inicial a Cloudflare Pages.
- **Fase 2:** Portafolio — sistema de tarjetas de proyecto (data-driven desde un archivo `projects.ts`/`projects.json` para que agregar proyectos sea trivial), categorías A, B, F.
- **Fase 3:** Exhibiciones especiales — ERP (según decisión 5.A), sistemas de IA (según decisión 5.B), analítica de datos.
- **Fase 4:** Página "El Ingeniero" + sistema de blog/foro MDX.
- **Fase 5:** Captación de leads — formulario, Apps Script, integración Sheets, flujo WhatsApp, pruebas end-to-end.
- **Fase 6:** Pulido — SEO/OG/schema, accesibilidad, performance, QA responsivo, documentación (`README` con: cómo agregar un proyecto, cómo publicar un post, cómo redesplegar el Apps Script).

**Criterio de cierre de cada fase:** build sin errores, responsivo verificado, y resumen de entregables esperando mi "APROBADO" antes de continuar.

---

## 9. CRITERIOS DE ACEPTACIÓN GLOBALES

1. El sitio comunica en <5 segundos qué es Pixies y quién está detrás.
2. Cada proyecto es entendible por un reclutador técnico en <30 segundos (bullets específicos, stack visible, link funcional).
3. La sección de Samuel se percibe como "el fundador/cerebro de una empresa", jamás como CV de búsqueda de empleo.
4. Un lead nunca se pierde: guardado en Sheets garantizado antes de cualquier redirección.
5. Cero costos fijos: todo corre en free tiers permanentes.
6. Agregar un proyecto nuevo o un post nuevo requiere editar un solo archivo + commit.
7. Lighthouse ≥ 90 en las cuatro métricas.
8. El diseño no podría confundirse con una plantilla: hay una decisión de firma visual identificable.

---

**COMIENZA AHORA CON LA FASE 0.** Recuerda: solo planificación, arquitectura, sistema de diseño propuesto, recomendaciones sobre las decisiones abiertas (5.A, 5.B, 5.C) y lista de datos que necesitas. Ningún código hasta recibir "APROBADO".
