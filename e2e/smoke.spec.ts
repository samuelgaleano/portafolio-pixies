import { test, expect } from '@playwright/test';

// 4 smoke tests (plan F5-F6 §4): lo que los unit tests no ven — el navegador real.

test('home renderiza: hero, 6 categorías, proyectos reales y el tour de datos', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#wordmark')).toHaveText('PIXIES');
  // el launcher tiene un acceso por categoría (saltan a su sección)
  const links = page.getByRole('navigation', { name: 'Categorías del portafolio' }).getByRole('link');
  await expect(links).toHaveCount(6);
  // secciones apiladas: el contenido real vive en sus categorías (CIC en catálogo)
  await expect(page.locator('#landing').getByText('Xiaomi CarTech')).toBeVisible();
  await expect(page.locator('#catalogo').getByText('CIC Inmuebles')).toBeVisible();
  await expect(page.locator('#empresarial').getByText('Sincronización de televisores en red local')).toBeVisible();
  // 'datos' exhibe el análisis Saber 11 con el enlace al informe
  await expect(page.locator('#datos').getByRole('link', { name: /Leer el informe completo/ })).toBeVisible();
});

test('portal del hero: el acceso al ingeniero enlaza a /samuel', async ({ page }) => {
  await page.goto('/');
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
  await expect(page.getByRole('heading', { level: 1 })).toContainText('cero al mes');
  // Shiki marca el bloque con data-language (restaurado en la auditoría)
  await expect(page.locator('[data-language="ts"]').first()).toBeVisible();
});

test('launcher: un acceso salta a su sección', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Categorías del portafolio' });
  await nav.getByRole('link', { name: /Sistema ERP/ }).click();
  await expect(page.locator('#erp')).toBeInViewport();
});

// Red de seguridad de las zonas oprimibles (Samuel): son fáciles de romper en silencio con un
// z-index o un pointer-events, y no se ven rotas — solo "no pasa nada" al oprimir.
test('catálogo oprimible: toda la tarjeta y la miniatura del launcher llevan a su destino', async ({ page }) => {
  await page.goto('/');

  // 1) el cuadrado ENTERO de la tarjeta navega al sitio del producto: quien recibe el clic en la
  //    previa, el título y el tagline debe ser el enlace estirado, no la imagen ni el texto.
  const card = page.locator('.proj-card').filter({ hasText: 'Xiaomi CarTech' }).first();
  const href = await card.locator('a[aria-label]').getAttribute('href');
  expect(href).toBeTruthy();
  await card.hover();
  for (const zona of [card.locator('> div').first(), card.locator('h4'), card.locator('h4 + p')]) {
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
