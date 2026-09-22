import { test, expect } from '@playwright/test';

// 4 smoke tests (plan F5-F6 §4): lo que los unit tests no ven — el navegador real.

// grupo-y-marketing (2026-09): el portafolio se movió de `/` a `/web` — este test antes
// vivía en `/` y verificaba las 7 categorías ahí; ahora `/` es la landing del grupo
// (hero + bifurcación) y `/web` es quien tiene el portafolio completo.
test('home renderiza: wordmark animado del grupo, bifurcación y proyecto de punta a punta', async ({ page }) => {
  await page.goto('/');
  // la home es el GRUPO: título del grupo y Organization con las dos divisiones colgando
  await expect(page).toHaveTitle(/^Pixies Design Group/);
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(ld).toContain('"name":"Pixies Design Group"');
  expect(ld).toContain('"subOrganization"');
  // el mismo PIXIES animado de /web (PixelCanvas, menos partículas) y el h1 accesible
  await expect(page.locator('#wordmark')).toHaveText('PIXIES');
  await expect(page.locator('#wordmark + canvas')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.dataset.division)).toBe('grupo');
  // la selección de división es la bifurcación (sin tarjetas chicas en el hero de la home)
  await expect(page.locator('.hero-firma')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Ver Pixies Creative' })).toHaveAttribute('href', '/marketing');
  await expect(page.getByRole('link', { name: 'Ver Pixies Digital Web Design' })).toHaveAttribute('href', '/web');
  // justo debajo: los 8 pasos de un proyecto completo, con los dos casos reales
  await expect(page.locator('#proceso .paso')).toHaveCount(8);
  await expect(page.locator('#proceso').getByText('Xiaomi CarTech')).toBeVisible();
  await expect(page.locator('#proceso').getByText('Mamba Records')).toBeVisible();
});

// Header del grupo (mockup → producción): marca del grupo + selector "ver como" con las dos
// divisiones + Grupo, indicador y CTA con el color de la ruta activa. "Ingeniero" ya no es
// enlace de primer nivel.
test('header: selector "ver como" marca la división de la ruta y el hilo de color la sigue', async ({ page }) => {
  await page.goto('/marketing');
  const nav = page.getByRole('navigation', { name: 'Ver como' });
  await expect(nav.getByRole('link')).toHaveCount(3);
  await expect(nav.getByRole('link', { name: 'Creative' })).toHaveAttribute('aria-current', 'page');
  expect(await page.evaluate(() => document.documentElement.dataset.division)).toBe('creative');
  // el CTA del header toma el texto de Creative y no existe "Ingeniero" en el header
  const header = page.locator('header');
  await expect(header.getByRole('link', { name: /Hablemos de tu marca/ })).toBeVisible();
  await expect(header.getByRole('link', { name: 'Ingeniero' })).toHaveCount(0);

  // navegar por el selector cambia la ruta, el atributo y el activo
  await nav.getByRole('link', { name: 'Web' }).click();
  await expect(page).toHaveURL(/\/web$/);
  await expect(nav.getByRole('link', { name: 'Web' })).toHaveAttribute('aria-current', 'page');
  expect(await page.evaluate(() => document.documentElement.dataset.division)).toBe('web');
});

test('/web renderiza: hero, 7 categorías, proyectos reales y el tour de datos', async ({ page }) => {
  await page.goto('/web');
  await expect(page.locator('#wordmark')).toHaveText('PIXIES');
  // el launcher tiene un acceso por categoría (saltan a su sección)
  const links = page.getByRole('navigation', { name: 'Categorías del portafolio' }).getByRole('link');
  await expect(links).toHaveCount(7);
  // secciones apiladas: el contenido real vive en sus categorías (CIC en catálogo)
  await expect(page.locator('#landing').getByText('Xiaomi CarTech')).toBeVisible();
  await expect(page.locator('#catalogo').getByText('CIC Inmuebles')).toBeVisible();
  await expect(page.locator('#empresarial').getByText('Sincronización de televisores en red local')).toBeVisible();
  // 'datos' exhibe el análisis Saber 11 con el enlace al informe
  await expect(page.locator('#datos').getByRole('link', { name: /Leer el informe completo/ })).toBeVisible();
});

test('portal del hero: el acceso al ingeniero enlaza a /samuel', async ({ page }) => {
  // grupo-y-marketing (2026-09-21): el portal del ingeniero es identidad de la división Web
  // (vive en el Hero de /web); la landing del grupo (/) tiene su propio GrupoHero sin portal.
  await page.goto('/web');
  // responsive: hay dos instancias del portal (una anclada en desktop, otra en la fila CTA para
  // móvil); ambas enlazan a /samuel. Verificamos la primera del DOM (la de desktop).
  const portal = page.locator('.eng-portal').first();
  await expect(portal).toHaveAttribute('href', '/samuel');
  await expect(portal).toContainText('Samuel Galeano');
});

test('/samuel y un post renderizan (highlight de código incluido)', async ({ page }) => {
  await page.goto('/samuel');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('cerebro detrás de Pixies');

  await page.goto('/samuel/posts/hola-mundo-pixies');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('no me cuesta nada al mes');
  // Shiki marca el bloque con data-language (restaurado en la auditoría)
  await expect(page.locator('[data-language="ts"]').first()).toBeVisible();
});

test('launcher: un acceso salta a su sección', async ({ page }) => {
  await page.goto('/web');
  const nav = page.getByRole('navigation', { name: 'Categorías del portafolio' });
  await nav.getByRole('link', { name: /Sistema ERP/ }).click();
  await expect(page.locator('#erp')).toBeInViewport();
});

// Red de seguridad de las zonas oprimibles (Samuel): son fáciles de romper en silencio con un
// z-index o un pointer-events, y no se ven rotas — solo "no pasa nada" al oprimir.
test('catálogo oprimible: toda la tarjeta y la miniatura del launcher llevan a su destino', async ({ page }) => {
  await page.goto('/web');

  // 1) el cuadrado ENTERO de la tarjeta navega al sitio del producto: quien recibe el clic en la
  //    previa, el título y las tecnologías debe ser el enlace estirado, no la imagen ni el texto.
  //    (Samuel r23: la tarjeta se simplificó a preview + nombre + tecnologías; la descripción se
  //    movió al desplegable de detalles, ya no es un <p> visible junto al <h4>.)
  const card = page.locator('.proj-card').filter({ hasText: 'Xiaomi CarTech' }).first();
  const href = await card.locator('a[aria-label]').getAttribute('href');
  expect(href).toBeTruthy();
  await card.hover();
  for (const zona of [card.locator('> div').first(), card.locator('h4'), card.locator('h4 + div')]) {
    const box = await zona.boundingBox();
    expect(box).not.toBeNull();
    const recibe = await page.evaluate(
      ([x, y]: number[]) => document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href') ?? null,
      [box!.x + box!.width / 2, box!.y + box!.height / 2],
    );
    expect(recibe).toBe(href);
  }

  // 2) la miniatura del launcher flota FUERA del tile: aun así es oprimible y salta a la sección
  const tile = page.locator('.portfolio-tile').filter({ hasText: 'Sistema ERP' }).first();
  await tile.hover();
  const miniatura = tile.locator('.portfolio-tile__preview');
  await expect(miniatura).toHaveCSS('opacity', '1');
  await miniatura.locator('img').click();
  await expect(page).toHaveURL(/#erp$/);
});

test('LeadForm: validación en cliente y envío feliz contra /api/leads', async ({ page }) => {
  // La API se mockea en el borde del navegador: el handler ya tiene sus propios tests
  await page.route('**/api/leads', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  );
  await page.goto('/#contacto');

  // inválido: errores accesibles visibles y NO se envía
  await page.getByRole('button', { name: /Enviar/ }).click();
  await expect(page.locator('#err-nombre')).toBeVisible();
  await expect(page.locator('#err-contacto')).toBeVisible();

  // válido: estado de éxito en el aria-live
  await page.locator('#lead-nombre').fill('Ana Pérez');
  await page.locator('#lead-contacto').fill('ana@ejemplo.com');
  await page.locator('#lead-tipo').selectOption('Landing page');
  await page.getByRole('button', { name: /Enviar/ }).click();
  await expect(page.getByText(/Recibido/)).toBeVisible();
});

// grupo-y-marketing (2026-09): /marketing es la división nueva — verifica que las 7
// secciones reales estén, que los casos honestos se lean (con y sin cifra) y que su
// propio LeadForm funcione igual que el de /web.
test('/marketing renderiza: hero, servicios, dónde se aplica, método, equipo, comparativa y casos', async ({ page }) => {
  await page.goto('/marketing');
  await expect(page.getByRole('heading', { level: 1, name: 'Pixies Creative' })).toBeVisible();
  // Isabela al frente de campañas y redes (Samuel, 2026-09-22): en el hero, como líder del
  // primer cubo de servicios y como primera tarjeta (destacada) del equipo
  await expect(page.locator('.hero-frentes .hero-frente').first()).toContainText('Isabela Torrenegra');
  const cubo1 = page.locator('#servicios .cubo').first();
  await expect(cubo1).toContainText('Campañas en redes y comunidad');
  await expect(cubo1.locator('.cubo__lider')).toContainText('Isabela Torrenegra');
  await expect(page.locator('#equipo .equipo__card').first()).toHaveClass(/equipo__card--lidera/);
  await expect(page.locator('#equipo .equipo__card').first()).toContainText('Isabela Torrenegra');
  await expect(page.locator('#equipo').getByText('Samuel Galeano')).toBeVisible();
  await expect(page.locator('#equipo').getByText('Edison Galeano')).toBeVisible();
  // áreas de implementación: seis situaciones, con los tres casos reales y ninguno inventado
  await expect(page.locator('#areas .area')).toHaveCount(6);
  await expect(page.locator('#areas').getByText('Xiaomi CarTech')).toBeVisible();
  await expect(page.locator('#areas').getByText('Mamba Records')).toBeVisible();
  await expect(page.locator('#metodo').getByText('Estrategia')).toBeVisible();
  await expect(page.locator('#comparativa').getByRole('columnheader', { name: 'Lo que hacemos' })).toBeVisible();
  await expect(page.locator('#comparativa').getByText('Costo por lead calificado')).toBeVisible();
  // caso con cifra real (LinkedIn) y caso sin cifra (Xiaomi CarTech, marcado "por confirmar").
  // "162.936" aparece dos veces dentro del propio caso (la cifra grande Y la descripción) —
  // se apunta a la cifra grande (font-display text-3xl) para no chocar con modo estricto.
  const casoLinkedin = page.locator('#casos article').filter({ hasText: 'LinkedIn de Samuel' });
  await expect(casoLinkedin.locator('p.font-display.text-3xl')).toContainText('162.936');
  await expect(page.locator('#casos').getByText('cifras por confirmar')).toBeVisible();
});

test('/marketing: LeadForm propio funciona igual que el de /web', async ({ page }) => {
  await page.route('**/api/leads', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  );
  await page.goto('/marketing#contacto');
  await page.locator('#lead-nombre').fill('Ana Pérez');
  await page.locator('#lead-contacto').fill('ana@ejemplo.com');
  await page.locator('#lead-tipo').selectOption('Landing page');
  await page.getByRole('button', { name: /Enviar/ }).click();
  await expect(page.getByText(/Recibido/)).toBeVisible();
});

// La bifurcación de la home es el único camino de navegación entre las 3 rutas del
// grupo: si se rompe, cada división queda aislada de las otras dos.
test('bifurcación del grupo: los paneles llevan a /marketing y /web de verdad', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Ver Pixies Creative' }).click();
  await expect(page).toHaveURL(/\/marketing$/);

  await page.goto('/');
  await page.getByRole('link', { name: 'Ver Pixies Digital Web Design' }).click();
  await expect(page).toHaveURL(/\/web$/);
});

// El morph del glifo es progresivo (Samuel: "no que solo cambie el frame"): cada celda del
// ícono entra con su propio desfase. Se comprueba que las celdas "c-in" del glifo NO fijo
// tienen retardos distintos entre sí y que al hover pasan a opacidad 1.
test('glifo M/W: morph progresivo celda por celda al hover del panel', async ({ page }) => {
  await page.goto('/');
  const panel = page.locator('.grupo-cap--web');
  await panel.scrollIntoViewIfNeeded();
  const celdasIn = panel.locator('.division-glyph i.c-in');
  await expect(celdasIn.first()).toBeAttached();
  const delays = await celdasIn.evaluateAll((els) => els.map((el) => getComputedStyle(el).transitionDelay));
  expect(new Set(delays).size).toBeGreaterThan(1);
  await expect(celdasIn.first()).toHaveCSS('opacity', '0');
  await panel.hover();
  await expect(celdasIn.last()).toHaveCSS('opacity', '1', { timeout: 2000 });
});
