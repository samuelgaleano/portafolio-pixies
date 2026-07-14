# Spec: "Capa viva" — mejoras disruptivas basadas en 5 referencias

Fecha: 2026-07-14 · Pedido de Samuel: analizar heatbureau.com, clicktokeep.com, kargo-studio.com, wairk.fr y barbianaliu.com (código, estructura, visual, front) y traer al portafolio vistas e interacciones que lo vuelvan más disruptivo y creativo, con buenas prácticas y optimizando siempre.

## Análisis de las referencias (verificado con Playwright: stack + screenshots)

| Sitio | Stack | Técnicas que lo hacen memorable |
|---|---|---|
| Heat Bureau | Framer | `cursor: none` + cursor custom; hero mínimo oscuro; metáfora de escritorio OS (carpeta "PROJECTS"); línea de estado inferior |
| clicktokeep | Wix + three.js + lenis | Statement editorial con tipografía gigante y palabras subrayadas; stickers de media con nombre de archivo (LOVE.GIF, UNBOXING.MP4); scroll horizontal; 170 videos |
| Kargo | Framer | Video takeover con nav en línea media; **hora local en vivo** ("ARCHIVES 10:08 AM"); cursor oculto |
| WAIRK | estático | Wordmark gigante **recortado por el borde** del viewport; **reloj vivo top-center** ("10:08:17 – 14 JUIL. 2026"); metadata mono anclada a esquinas; marquee |
| Barbiana Liu | estático | **Arte ASCII decorativo** (mariposa, cadena hechos de caracteres $, +, -); etiquetas `[WORK]`/`[CONTACT ME]`; reloj vivo ("Tue 10:08:35 AM"); foto recortada |

**Hilo común destilado:** (1) una *capa de datos mono viva* — relojes, coordenadas, nombres de archivo — que hace sentir el sitio como un sistema encendido; (2) tipografía masiva que no teme recortarse; (3) metáforas de sistema (carpetas, archivos, caracteres como materia prima); (4) cursor propio.

## Traducción a Pixies (sin romper la identidad)

El píxel ya es nuestra materia prima; estas referencias validan llevarlo a una **capa de sistema vivo**. Seis features, todas CSS/JS vanilla ligero, sin dependencias nuevas:

1. **Cursor píxel** (`PixelCursor`, client): cuadrado violeta de 12px que sigue el cursor con lerp; sobre elementos interactivos se convierte en marco de 32px con borde (eco de los `[BRACKET]` de Barbiana). Solo `pointer: fine`, apagado con reduced-motion, `cursor: none` vía clase que pone JS al montar (sin JS: cursor nativo intacto). rAF que se detiene al asentarse.
2. **Marquee de servicios** (`ServicesMarquee`, server + CSS): franja entre hero y portafolio con las 6 categorías (desde `categories.ts`) separadas por ▪, animación `translateX` infinita en compositor, pausa en hover, estática con reduced-motion. Da ritmo entre el hero vivo y el contenido.
3. **Statement editorial** (`Statement`, server): sección de afirmaciones gigantes en display entre portafolio y MidCta — "El software que mostramos **corre en producción**. Las cifras que citamos **se pueden auditar**. El diseño que ves **es la demo**." — reveal por línea con el sistema `data-reveal` existente. Solo afirmaciones verificables (regla de PRODUCT.md).
4. **Arte de píxeles en caracteres** (`PixelGlyph`, server): motivos decorativos dibujados con caracteres de bloque (▀▄█▚), la versión Pixies del arte ASCII de Barbiana. `<pre>` estático, `aria-hidden`, cero JS. Ubicados en Statement y Footer.
5. **Reloj vivo BOG** (`LiveStatus`, client): `bogotá · HH:MM:SS · gmt-5` con `Intl.DateTimeFormat` (America/Bogota), tick de 1s, placeholder `--:--:--` en SSR. En la barra de estado del footer.
6. **Footer takeover**: el footer gana una barra de estado mono (reloj vivo + disponibilidad), una línea CTA grande hacia `#contacto`, y un wordmark PIXIES gigante **recortado por el borde inferior** (WAIRK), en tinta sutil sobre void, `aria-hidden`.

## Reglas que se actualizan en DESIGN.md

- **Motion:** además del hero, existe una "capa de datos viva" de bajo consumo: marquee (compositor), reloj (texto 1s), cursor (rAF on-demand). El resto del sitio sigue quieto.
- **Firma:** los glifos de caracteres de bloque son ecos del píxel permitidos en zonas de respiro (statement, footer); no compiten con las 3 firmas mayores.

## Presupuesto de rendimiento

- Sin dependencias nuevas; sin WebGL; sin videos.
- Marquee: `transform` puro (compositor). Cursor: 1 elemento, rAF solo en movimiento. Reloj: 1 `setInterval` de 1s.
- Gate: LCP/CLS no empeoran (re-medición con el script de auditoría), 60fps en scroll desktop.

## Verificación

- e2e nuevos: marquee presente y estático bajo reduced-motion; cursor píxel presente con pointer fino y ausente con reduced-motion; reloj con formato `\d{2}:\d{2}:\d{2}`; statement y wordmark del footer renderizados.
- Unit: helper de hora Bogotá (`lib/clock.ts`).
- Suite completa + build + screenshots headless.

## Fuera de alcance

- Scroll horizontal y smooth-scroll global (lenis): alto costo de UX/a11y para el beneficio.
- Videos de fondo (Kargo) y three.js (clicktokeep): pesan contra el presupuesto de perf y no hay assets.
- Cropping del wordmark del hero (el canvas necesita muestrear las letras completas).
