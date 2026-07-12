# Pixies · Digital Web Design

Portafolio oficial de **Pixies Digital Web Design** — Design Group by Samuel Galeano, Ingeniero de Sistemas.

> Este sitio es, en sí mismo, el primer proyecto del portafolio: diseño propio ("Ensamblaje de píxeles"), costo fijo **$0** y cada decisión de ingeniería documentada en [docs/DECISIONES.md](docs/DECISIONES.md).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** estricto
- **Tailwind CSS v4** sobre tokens de diseño propios ([src/styles/tokens.css](src/styles/tokens.css))
- Blog **MDX** (`gray-matter` + `next-mdx-remote`), código con Shiki
- Captación de leads: **Route Handler** → Google Apps Script → Google Sheet + WhatsApp
- Tests: **Vitest** (unit) + **Playwright** (smoke E2E) · Lint **ESLint** · **CI** en GitHub Actions
- Deploy: **Vercel** (auto-deploy en cada push a `main`)

## Correr en local

```bash
npm ci
cp .env.example .env.local   # y completa las 2 variables (ver leads, abajo)
npm run dev                  # http://localhost:3000
```

| Script | Qué hace |
|---|---|
| `npm run check` | Type-check (tsc) |
| `npm run lint` | ESLint |
| `npm test` | Tests unitarios (Vitest) |
| `npm run test:e2e` | Smoke E2E (Playwright, buildea y sirve) |
| `npm run build` | Build de producción |

---

## Operación: cómo editar el sitio

### ➕ Agregar un proyecto al portafolio
Edita [src/data/projects.ts](src/data/projects.ts) y añade un objeto:
```ts
{
  id: 'mi-proyecto',           // slug único
  category: 'landing',         // landing | catalogo | erp | datos | ia | empresarial
  name: 'Nombre real',
  tagline: 'Una línea de valor de negocio.',
  bullets: ['Stack real', 'Decisión de ingeniería', 'Resultado medible'],
  stack: ['react', 'supabase'], // ids de src/data/tech.ts (typo = error de compilación)
  status: 'produccion',        // 'produccion' → usa liveUrl | 'codigo' → usa repoUrl
  liveUrl: 'https://…',
  preview: { src: '', alt: 'Vista de…' }, // src '' = placeholder pixelado
}
```
Para un screenshot real: ponlo en `public/` y usa su ruta en `preview.src`. Commit → deploy automático.

### 📝 Publicar un post en el foro
Crea un archivo `.mdx` en [src/content/posts/](src/content/posts/):
```mdx
---
title: "Título del post"
description: "Resumen para el listado y las tarjetas al compartir."
pubDate: 2026-08-01
tags: ["ia", "emprender"]
draft: false          # true = no se publica
---

Contenido en Markdown/MDX…
```
El build **falla** si falta `title`, `description` o `pubDate` (protege la calidad). Commit → publicado.

### 👤 Actualizar /samuel
- Trayectoria/certificados: [src/data/certifications.ts](src/data/certifications.ts)
- Capacidades por dominio: [src/data/skills.ts](src/data/skills.ts)
- Historias de proyecto: [src/data/stories.ts](src/data/stories.ts)
- Manifiesto y textos: [src/i18n/es.ts](src/i18n/es.ts) → `samuel`

### 🎨 Cambiar textos, colores o datos de contacto
- **Textos de UI:** [src/i18n/es.ts](src/i18n/es.ts) (un solo archivo)
- **Colores/tipografía/espaciado:** [src/styles/tokens.css](src/styles/tokens.css) (una sola fuente de verdad)
- **WhatsApp, correo, redes, dominio:** [src/data/site.ts](src/data/site.ts)

### 📨 Leads: conectar el Google Sheet y redesplegar el Apps Script
Guía completa (10 min): [apps-script/DESPLIEGUE.md](apps-script/DESPLIEGUE.md). En resumen:
1. Crea el Sheet → pega [apps-script/Code.gs](apps-script/Code.gs) → despliega como Web App.
2. Pon `LEADS_WEBHOOK_URL` (la URL `/exec`) y `LEADS_SECRET` en `.env.local` (local) y en Vercel (producción).
3. **Si editas `Code.gs`:** Implementar → Administrar implementaciones → editar → Nueva versión (mantiene la misma URL).

### 🚀 Desplegar
Cada `push` a `main` redespliega en Vercel automáticamente. Primera vez: importar el repo en [vercel.com/new](https://vercel.com/new) (framework Next.js, detectado solo) y configurar las 2 env vars de leads.

---

## Datos reales pendientes (`[COMPLETAR: …]`)

El sitio funciona con placeholders visibles. Para el lanzamiento, reemplaza en estos archivos:

| Dónde | Qué |
|---|---|
| `src/data/site.ts` | WhatsApp (`+57…`), correo, GitHub, LinkedIn, Instagram, dominio |
| `src/data/projects.ts` | Nombre, URL/repo, stack y bullets reales de cada proyecto (+ screenshots) |
| `src/data/erp-tour.ts` | Nombre, repo, screenshots y detalles del ERP |
| `src/data/agent-replays.ts` | Pipeline y logs reales del sistema de IA |
| `src/data/skills.ts` · `certifications.ts` · `stories.ts` | Estudios, certificados con enlaces, historias |
| `src/i18n/es.ts` → `samuel.manifesto` | Manifiesto personal |
| `src/content/posts/hola-mundo-pixies.mdx` | Primer post real |
| Apps Script | El `SECRET` y las env vars (ver DESPLIEGUE.md) |

Buscar todos: `grep -rn "\[COMPLETAR" src/`

---

## Documentación

- [docs/PLAN-MAESTRO-FASE-0.md](docs/PLAN-MAESTRO-FASE-0.md) — plan maestro y bitácora de fases
- [docs/PLAN-F5-F6.md](docs/PLAN-F5-F6.md) — diseño de leads y paquete visual
- [docs/DECISIONES.md](docs/DECISIONES.md) — registro de decisiones y auditorías
- `PRODUCT.md` · `DESIGN.md` — contexto y sistema de diseño
