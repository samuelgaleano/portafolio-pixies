# Design

Dirección: **"Ensamblaje de píxeles"** — Pixies construye cosas digitales; el píxel es su materia prima. El sitio escenifica ese acto de construcción una sola vez, en grande (hero), y lo reutiliza solo en 2 micro-interacciones. Fuente de verdad implementada: `src/styles/tokens.css` (Tailwind v4 `@theme`).

## Colors

| Token | Hex | Uso | Contraste sobre void |
|---|---|---|---|
| `void` | `#0B0D12` | Fondo base (negro azulado, NO negro puro) | — |
| `surface` | `#141824` | Tarjetas, paneles | — |
| `surface-2` | `#1C2130` | Hover, código, consola | — |
| `ink` | `#F2F3F7` | Texto principal | 15.9:1 AAA |
| `dim` | `#9AA3B8` | Texto secundario | 7.4:1 AA |
| `pixel` | `#7C5CFF` | **Primario**: marca, enlaces, foco | gráficos/texto grande |
| `pixel-soft` | `#A78BFF` | Texto violeta sobre oscuro | AA |
| `signal` | `#FF5D73` | **SOLO CTAs de conversión** — texto `void` encima | — |
| `data` | `#5FD4F5` | **SOLO capa técnica**: mono, badges, logs | — |
| `ok` / `err` | `#4ADE80` / `#F87171` | Estados de formulario únicamente | — |

**Reglas:** violeta = identidad · coral = conversión (si todo es coral, nada convierte) · cyan = capa técnica. Jamás los tres en un mismo componente.

## Typography

| Rol | Fuente | Pesos | Uso |
|---|---|---|---|
| Display | Clash Display | 600/700 | SOLO wordmark, h1/h2, cifras grandes |
| Texto | General Sans | 400/500/600 | Cuerpo, UI, tarjetas |
| Mono | JetBrains Mono | 400/700 | Bullets técnicos, badges, consola, fechas |

Escala fluida: `text-hero` = `clamp(3.5rem, 13vw, 9rem)` / `text-h2` = `clamp(1.75rem, 4vw, 3rem)` / cuerpo 1rem/1.7. Self-hosted woff2 en `public/fonts/`, `font-display: swap`, preload de Clash 700 + General 400.

## Layout

- Contenedor máx. 1200px; grid 12 col desktop / 4 móvil; gutter 24px.
- Retícula visible sutil (`.grid-bg`, líneas `line` 32×32px) SOLO en hero y separadores de sección.
- Ritmo: secciones separadas por `clamp(4rem, 10vw, 8rem)`; aire generoso, ritmo editorial.
- Radios: 6px (s) / 12px (m). Geometría cuadrada/pixelada por concepto — sin círculos decorativos.

## Components

- **Button**: variante `signal` (CTA conversión: fondo coral, texto void, cuadrado 6px) y variante `ghost` (borde line, texto ink).
- **ProjectCard** (F2): preview scrollshot → nombre + tagline → bullets mono con `▸` → badges stack → etiqueta estado (`● En producción` ok / `⌥ Ver código` data). Tarjeta completa es link.
- **SectionTitle**: display 600, con índice mono opcional (`01 /`).
- **Header**: fijo, delgado, fondo void translúcido con blur; CTA coral compacto.

## Motion

- **Hero (única secuencia grande):** ~400 píxeles convergen y forman "PIXIES" en ~1.8s (canvas vanilla), luego el sitio queda quieto.
- Resto: fade-up 300ms al entrar al viewport (una vez) + transitions 150–200ms en hover.
- `prefers-reduced-motion`: hero estático con fade simple; todo lo demás sin animación.
- El movimiento tiene propósito o no existe.

## Signature

**La materialización pixelada — en exactamente 3 lugares y ninguno más:**
1. Hero: wordmark se ensambla desde píxeles (canvas → h1 real en DOM).
2. Foto de Samuel: mosaico pixelado grueso → nítida en hover/focus (CSS).
3. Tarjetas de proyecto: reveal con máscara de bloques en hover.

## Reglas transversales (aplican a TODO el proyecto, fases 2–6)

1. **Tema único oscuro, por decisión.** El "mundo void" ES la identidad; no habrá modo claro. Declarado con `color-scheme: dark` en global.css para que controles nativos y scrollbars rendericen oscuros. No es una omisión: está elegido.
2. **Medida de línea:** texto corrido ≤ ~65 caracteres (`max-w-xl` o `prose`). Headings con `text-wrap: balance`, párrafos con `text-wrap: pretty` (ya global).
3. **Cifras en columna** (dashboards de datos F3, tablas): `font-variant-numeric: tabular-nums`.
4. **Marcadores numerados (`01 /`) solo donde el orden informa.** Las categorías A–F del portafolio son secuencia narrativa: permitido ahí. Prohibido como decoración.
5. **Contenido ancho** (consola IA, tablas, código en posts): contenedor propio con `overflow-x: auto`; el body nunca scrollea horizontal.
6. **Copy desde el lado del usuario:** los controles dicen exactamente qué pasa ("Enviar" → "Recibido ✓"); los errores dicen qué falló y cómo resolverlo, sin disculpas vagas. Voz activa, específico gana a ingenioso.
7. **La estructura codifica información**, no decora: eyebrows, divisores y etiquetas solo si dicen algo verdadero del contenido.
8. **El acento no pelea con el fondo:** si un color de acento compite, se baja saturación o se mueve a análogo; nunca se agrega un cuarto acento.
