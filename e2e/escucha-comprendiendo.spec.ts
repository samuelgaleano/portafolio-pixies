import { test, expect } from '@playwright/test';

// Demo lite de escuchacomprendiendo.ai (§ plan "productos propios"). El ejemplo curado
// todavía no está listo (Samuel no lo completó aún) → arranca en la pestaña "en vivo",
// nunca mostrando el placeholder como si fuera contenido real.

test('arranca en la demo en vivo y se puede cambiar a la pestaña de ejemplo (en preparación)', async ({ page }) => {
  await page.goto('/#productos');

  const tabVivo = page.getByRole('tab', { name: 'Probá con tu audio' });
  const tabCurada = page.getByRole('tab', { name: 'Ejemplo real' });
  await expect(tabVivo).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Soltá o elegí un audio corto')).toBeVisible();

  await tabCurada.click();
  await expect(tabCurada).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Ejemplo en preparación')).toBeVisible();

  await page.getByText('Probar con mi propio audio →').click();
  await expect(tabVivo).toHaveAttribute('aria-selected', 'true');
});

test('subir un audio corto muestra el resultado estructurado (API mockeada)', async ({ page }) => {
  await page.route('**/api/escucha-demo/transcribe', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        durationSec: 4,
        transcript: { text: 'hola mundo', segments: [{ start: 0, end: 4, text: 'hola mundo' }] },
      }),
    })
  );
  await page.route('**/api/escucha-demo/structure', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        structured: {
          resumen: 'Una nota de prueba',
          areas: [
            {
              nombre: 'Área de prueba',
              conceptos: [],
              decisiones: [{ texto: 'Decisión de ejemplo', citas: [0] }],
              tareas: [],
              riesgos: [],
              noSeSabe: [],
            },
          ],
        },
      }),
    })
  );

  await page.goto('/#productos');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'nota.mp3',
    mimeType: 'audio/mpeg',
    buffer: Buffer.from('contenido de prueba'),
  });

  await expect(page.getByText('Decisión de ejemplo')).toBeVisible();
  await expect(page.getByText('Una nota de prueba')).toBeVisible();
});

test('si el proveedor falla, avisa y ofrece el ejemplo curado en vez de romperse', async ({ page }) => {
  await page.route('**/api/escucha-demo/transcribe', (route) =>
    route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ error: 'proveedor' }) })
  );

  await page.goto('/#productos');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'nota.mp3',
    mimeType: 'audio/mpeg',
    buffer: Buffer.from('contenido de prueba'),
  });

  await expect(page.getByText('El procesamiento en vivo está saturado ahora mismo.')).toBeVisible();
  await page.getByText('Mirá un ejemplo real ya procesado →').click();
  await expect(page.getByText('Ejemplo en preparación')).toBeVisible();
});
