# Pixies · Digital Web Design

Portafolio oficial de **Pixies Digital Web Design** — Design Group by Samuel Galeano, Ingeniero de Sistemas.

> Este sitio es, en sí mismo, el primer proyecto del portafolio: diseño propio ("Ensamblaje de píxeles"), costo fijo **$0** y cada decisión de ingeniería documentada en [docs/DECISIONES.md](docs/DECISIONES.md).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** estricto
- **Tailwind CSS v4** sobre tokens de diseño propios ([src/styles/tokens.css](src/styles/tokens.css))
- Blog **MDX** (`gray-matter` + `next-mdx-remote`), highlight con Shiki
- Tests con **Vitest** · Lint con **ESLint** · CI en GitHub Actions
- Deploy: **Vercel**

## Correr en local

```bash
npm ci
npm run dev      # http://localhost:3000
```

| Script | Qué hace |
|---|---|
| `npm run check` | Type-check (tsc) |
| `npm run lint` | ESLint |
| `npm test` | Tests (Vitest) |
| `npm run build` | Build de producción |

## Cómo editar el contenido

- **Agregar un proyecto:** un objeto en [src/data/projects.ts](src/data/projects.ts) (+ screenshot). El tipado convierte los typos en errores de compilación.
- **Publicar un post:** un `.mdx` en [src/content/posts/](src/content/posts/) con `title`, `description` y `pubDate` — el build falla si el frontmatter está mal formado.
- **Textos de UI:** [src/i18n/es.ts](src/i18n/es.ts) · **Datos de contacto:** [src/data/site.ts](src/data/site.ts)

## Estado

Construido por fases con gates de verificación (plan completo en [docs/PLAN-MAESTRO-FASE-0.md](docs/PLAN-MAESTRO-FASE-0.md)). Fases 1–4 completas; en curso: captación de leads (F5) y pulido final (F6). Los `[COMPLETAR: …]` visibles son placeholders deliberados a la espera de datos reales.
