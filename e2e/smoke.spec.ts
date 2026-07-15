import { test, expect } from '@playwright/test';

// 4 smoke tests (plan F5-F6 §4): lo que los unit tests no ven — el navegador real.

test('home renderiza: hero, 6 categorías, proyectos reales y estado vacío diseñado', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#wordmark')).toHaveText('PIXIES');
  await expect(page.locator('.cat-chip')).toHaveCount(6);
  // proyectos reales visibles en sus categorías
  await expect(page.locator('#landing').getByText('Xiaomi CarTech')).toBeVisible();
  await expect(page.locator('#empresarial').getByText('Sincronización de televisores en red local')).toBeVisible();
  // 'datos' no tiene caso aún: muestra el estado vacío que convierte (no esqueletos)
  await expect(page.locator('#datos').getByText('Casos en curado')).toBeVisible();
});

test('firma del hero: la cita del ingeniero enlaza a /samuel', async ({ page }) => {
  await page.goto('/');
  const sig = page.locator('.engineer-signature');
  await expect(sig).toHaveAttribute('href', '/samuel');
  await expect(sig).toContainText('la mente detrás de');
});

test('/samuel y un post renderizan (highlight de código incluido)', async ({ page }) => {
  await page.goto('/samuel');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('cerebro detrás de Pixies');

  await page.goto('/samuel/posts/hola-mundo-pixies');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('cero al mes');
  // Shiki marca el bloque con data-language (restaurado en la auditoría)
  await expect(page.locator('[data-language="ts"]').first()).toBeVisible();
});

test('scroll-spy: al llegar a #erp su chip gana aria-current', async ({ page }) => {
  await page.goto('/');
  await page.locator('#erp').scrollIntoViewIfNeeded();
  await expect(page.locator('.cat-chip[aria-current="true"]')).toHaveText('Sistema ERP', { timeout: 5000 });
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
