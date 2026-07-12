---
target: sitio completo
total_score: 32
p0_count: 1
p1_count: 2
timestamp: 2026-07-12T23-07-47Z
slug: sitio-completo
---
# Critique — sitio completo (dual-agent)
Método: dual-agent (A: design review · B: detector). Score Nielsen: 32/40 (Sólido).
## Veredicto AI-slop
NO es slop, pero hoy nadie lo puede comprobar: presentación cruda de [COMPLETAR] (P0) + uniformidad de receta fuera del hero. Detector: 3 hallazgos, 3 falsos positivos (clamp no parseado ×2, secuencia real 01-05).
## Heurísticas
H1:4 H2:3 H3:3 H4:3 H5:4 H6:3 H7:3 H8:2 H9:4 H10:3 = 32/40. Carga cognitiva: 2/8 fallas (6 chips nav; disclosure invertida en link de tarjeta).
## Issues
- P0 presentación de placeholders (hero FOTO_SAMUEL, 5 tarjetas esqueleto, footer ×4, manifiesto, credenciales, blockquote post)
- P1 promesa "enlace que funciona" sin enlaces
- P1 /samuel sin identidad visual propia; falta firma #2 (mosaico foto)
- P2 grids semivacíos (1 tarjeta en grid de 3); receta idéntica ×5 secciones
- P2 fugas: coral en teaser, link oculto hasta hover, "⌥ Ver código", badges 10.4px, skip/selection ~3.9:1, BUG wa.me/57 en SocialLinks
- B: --text-hero max 9rem=144px > espec 7.5rem y guía 6rem
## Fortalezas
Firma pixelada disciplinada; copy de conversión ("guardado pase lo que pase"); exhibiciones ERP/consola.
## Personas
Jordan: FOTO_SAMUEL crudo, chip cortado 375px. Casey: stagger 1.55-2.3s vs scroll inmediato, doble sticky. Riley: cero enlaces verificables, credenciales andamio.
