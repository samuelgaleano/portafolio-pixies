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
  // el mismo PIXIES animado de /web (PixelCanvas con el bitmap propio) y el h1 accesible
  await expect(page.locator('#wordmark')).toHaveText('PIXIES');
  await expect(page.locator('#wordmark + canvas')).toBeVisible();
  // el grupo destella en los DOS colores de división (violeta de Web + ámbar de Creative)
  const flick = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return [cs.getPropertyValue('--wm-flick').trim(), cs.getPropertyValue('--wm-flick-2').trim()];
  });
  expect(flick[0]).toBeTruthy();
  expect(flick[1]).toBeTruthy();
  expect(flick[0]).not.toBe(flick[1]);
  expect(await page.evaluate(() => document.documentElement.dataset.division)).toBe('grupo');
  // los dos accesos, como recuadros en los COSTADOS: Creative a la IZQUIERDA, Web a la DERECHA
  const creative = page.locator('.acceso--creative');
  const web = page.locator('.acceso--web');
  await expect(creative).toHaveAttribute('href', '/marketing');
  await expect(web).toHaveAttribute('href', '/web');
  const [cajaC, cajaW] = [await creative.boundingBox(), await web.boundingBox()];
  expect(cajaC!.x).toBeLessThan(cajaW!.x);
  // y el primer frame muestra logo → H2 → eslogan → CTA sin desplazar (900px de alto)
  for (const sel of ['#wordmark', '.hero-titulo__nombre', '.grupo-hero__eslogan', '.hero-cta']) {
    const caja = await page.locator(sel).first().boundingBox();
    expect(caja!.y + caja!.height).toBeLessThanOrEqual(900);
  }
  await expect(page.getByRole('link', { name: 'Ver Pixies Creative' })).toHaveAttribute('href', '/marketing');
  await expect(page.getByRole('link', { name: 'Ver Pixies Digital Web Design' })).toHaveAttribute('href', '/web');
  // justo debajo, la ruta: 6 pasos y TODOS son botones con un destino real (Samuel, 2026-09-22)
  const pasos = page.locator('#proceso .ruta__paso');
  await expect(pasos).toHaveCount(6);
  expect(await pasos.evaluateAll((els) => els.map((el) => el.getAttribute('href')))).toEqual([
    '/marketing#servicios',
    '/marketing#areas',
    '/marketing#casos',
    '/web#landing',
    '/web#erp',
    '/web#datos',
  ]);
  // los casos reales que recorrieron la ruta siguen citados (sin inventar tramos)
  await expect(page.locator('.ruta-casos')).toContainText('Xiaomi CarTech');
  await expect(page.locator('.ruta-casos')).toContainText('Mamba Records');
  // y el cierre del bucle de conocimiento enlaza a la app propia
  await expect(page.locator('.ruta-cierre a[href="/aplicaciones/escuchacomprendiendo-ai"]')).toBeVisible();
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

test('respaldo de ingeniería: manda el producto, la persona va como firma', async ({ page }) => {
  // Samuel (2026-09-22): el bloque del ingeniero pasa de retrato protagonista a RESPALDO —
  // primero lo que sostiene los productos, el nombre abajo y chico. Sigue enlazando a /samuel.
  await page.goto('/web');
  const respaldo = page.locator('.respaldo');
  await expect(respaldo.locator('.respaldo__eyebrow')).toHaveText(/respaldo de ingeniería/i);
  await expect(respaldo.locator('.respaldo__linea')).toContainText('ingeniero de sistemas');
  const quien = respaldo.locator('.respaldo__quien');
  await expect(quien).toHaveAttribute('href', '/samuel');
  await expect(quien).toContainText('Samuel Galeano');
  // el nombre es MÁS CHICO que la frase de respaldo: el foco está en el producto
  const [frase, nombre] = await Promise.all([
    respaldo.locator('.respaldo__linea').evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    respaldo.locator('.respaldo__nombre').evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ]);
  expect(nombre).toBeLessThan(frase);
});

test('los heros de las dos divisiones comparten estructura', async ({ page }) => {
  // Samuel (2026-09-22): "que web y creative tengan la misma estructura inicial, botones y
  // animaciones; que cambien colores, formas y contenido, no la estructura".
  for (const ruta of ['/web', '/marketing']) {
    await page.goto(ruta);
    const hero = page.locator('#inicio');
    await expect(hero.locator('#wordmark')).toHaveText('PIXIES');
    await expect(hero.locator('.hero-titulo__nombre')).toBeVisible();
    await expect(hero.locator('.hero-titulo__kicker')).toBeVisible();
    await expect(hero.locator('.hero-firma--compacta')).toBeVisible();
    await expect(hero.locator('.hero-fila__texto a[href="#contacto"]')).toHaveCount(1);
    await expect(hero.locator('.hero-fila__apoyo')).toBeVisible();
  }
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
  await nav.getByRole('link', { name: /sistema para mi operación/ }).click();
  await expect(page.locator('#erp')).toBeInViewport();
});

// Red de seguridad de las zonas oprimibles (Samuel): son fáciles de romper en silencio con un
// z-index o un pointer-events, y no se ven rotas — solo "no pasa nada" al oprimir.
test('catálogo oprimible: la tarjeta entera y la fila del menú llevan a su destino', async ({ page }) => {
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

  // 2) el catálogo (2026-09-22): fila entera oprimible, con título directo y evidencia
  const fila = page.locator('.catalogo-item').filter({ hasText: 'sistema para mi operación' }).first();
  await expect(fila).toHaveAttribute('href', '#erp');
  await expect(fila.locator('.catalogo-item__evidencia')).toContainText('Demo en vivo');
  // elementFromPoint usa coordenadas de VIEWPORT: hay que dejar la fila EN EL CENTRO (si
  // no, el punto cae fuera del viewport o debajo del header fijo y devuelve el logo). El
  // sitio tiene `scroll-behavior: smooth`, así que el salto va en 'instant': con el suave,
  // la caja se leía antes de terminar el desplazamiento.
  await fila.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const caja = await fila.boundingBox();
  const recibeFila = await page.evaluate(
    ([x, y]: number[]) => document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href') ?? null,
    [caja!.x + caja!.width - 24, caja!.y + caja!.height / 2],
  );
  expect(recibeFila).toBe('#erp');
  await fila.click();
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
  // el hero habla como EMPRESA: áreas y especialidad, sin nombres propios (2026-09-22)
  const frentes = page.locator('.hero-frentes');
  await expect(frentes.locator('.hero-frente').first()).toContainText('Campañas y redes');
  for (const nombre of ['Isabela', 'Edison', 'Samuel']) await expect(frentes).not.toContainText(nombre);
  // cada servicio es oprimible y dice con qué ayuda (Samuel: "que puedan oprimir, no solo leer")
  await expect(page.locator('#servicios .cubo__pedir')).toHaveCount(5);
  await expect(page.locator('#servicios .cubo').first().locator('.cubo__ayuda')).toBeVisible();
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
test('glifo C/W: morph progresivo celda por celda al hover del panel', async ({ page }) => {
  await page.goto('/');
  const panel = page.locator('.grupo-cap--web');
  await panel.scrollIntoViewIfNeeded();
  // retícula 7×9 (2026-09-22): 63 celdas por glifo, C para Creative y W para Web
  await expect(panel.locator('.division-glyph i')).toHaveCount(63);
  await expect(page.locator('.grupo-cap--marketing .division-glyph i')).toHaveCount(63);
  const celdasIn = panel.locator('.division-glyph i.c-in');
  await expect(celdasIn.first()).toBeAttached();
  const delays = await celdasIn.evaluateAll((els) => els.map((el) => getComputedStyle(el).transitionDelay));
  expect(new Set(delays).size).toBeGreaterThan(1);
  await expect(celdasIn.first()).toHaveCSS('opacity', '0');
  await panel.hover();
  await expect(celdasIn.last()).toHaveCSS('opacity', '1', { timeout: 2000 });
});
