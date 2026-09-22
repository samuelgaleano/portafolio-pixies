import { test, expect } from '@playwright/test';

// escuchacomprendiendo.ai: en la home ("Aplicaciones by Pixies") solo hay una tarjeta-teaser
// clicable; TODO lo interactivo vive en /aplicaciones/escuchacomprendiendo-ai. El ejemplo
// curado todavía no está listo (Samuel no lo completó aún) → esa página arranca en la
// pestaña "en vivo", nunca mostrando el placeholder como si fuera contenido real.

test('home: la tarjeta de la app es un teaser entero clicable que lleva a su página propia', async ({ page }) => {
  // grupo-y-marketing (2026-09): "Aplicaciones by Pixies" vive dentro del portafolio, que
  // se movió de / a /web.
  // Sin el ancla `#productos` a propósito: entrar por hash dispara el `scroll-behavior:
  // smooth` del sitio y ese desplazamiento sigue corriendo mientras se calcula el punto del
  // clic. Lo que se prueba aquí es que la tarjeta entera sea oprimible, no el salto al ancla.
  await page.goto('/web');
  const seccion = page.locator('#productos');
  await expect(seccion.getByRole('heading', { name: 'Aplicaciones by Pixies' })).toBeVisible();
  await expect(seccion.getByText('escuchacomprendiendo.ai')).toBeVisible();
  // la home NO despliega el demo: ni pestañas ni dropzone acá
  await expect(seccion.getByRole('tab')).toHaveCount(0);
  await expect(seccion.locator('input[type="file"]')).toHaveCount(0);

  // la tarjeta entera es un link estirado (mismo patrón que ProjectCard) → navega a la app.
  // Antes de oprimir hay que esperar a que la tarjeta DEJE DE MOVERSE: la página se sigue
  // acomodando un buen rato (swap de fuentes y reveals), y un punto calculado antes de que
  // pare cae fuera de la tarjeta — falló 2 de 6 veces hasta que se comprobó con
  // elementFromPoint. Con la espera: 8 de 8 (2026-09-22).
  const tarjeta = seccion.getByRole('link', { name: /escuchacomprendiendo\.ai — probar en vivo o descargar/ });
  await tarjeta.scrollIntoViewIfNeeded();
  let anterior = '';
  let quietas = 0;
  await expect
    .poll(
      async () => {
        const caja = await tarjeta.boundingBox();
        const actual = caja ? `${Math.round(caja.x)},${Math.round(caja.y)}` : '';
        quietas = actual !== '' && actual === anterior ? quietas + 1 : 0;
        anterior = actual;
        return quietas;
      },
      { timeout: 20_000, intervals: [120] }
    )
    .toBeGreaterThanOrEqual(4);
  await tarjeta.click();
  await expect(page).toHaveURL(/\/aplicaciones\/escuchacomprendiendo-ai$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('escuchacomprendiendo.ai');
});

test('arranca en la demo en vivo y se puede cambiar a la pestaña de ejemplo (en preparación)', async ({ page }) => {
  await page.goto('/aplicaciones/escuchacomprendiendo-ai');

  const tabVivo = page.getByRole('tab', { name: 'Prueba con tu audio' });
  const tabCurada = page.getByRole('tab', { name: 'Ejemplo real' });
  await expect(tabVivo).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Suelta o elige un audio corto')).toBeVisible();

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

  await page.goto('/aplicaciones/escuchacomprendiendo-ai');
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

  await page.goto('/aplicaciones/escuchacomprendiendo-ai');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'nota.mp3',
    mimeType: 'audio/mpeg',
    buffer: Buffer.from('contenido de prueba'),
  });

  await expect(page.getByText('El procesamiento en vivo está saturado en este momento.')).toBeVisible();
  await page.getByText('Ver un ejemplo real ya procesado →').click();
  await expect(page.getByText('Ejemplo en preparación')).toBeVisible();
});

test('botón "probar con un audio de muestra" corre el mismo pipeline real (API mockeada)', async ({ page }) => {
  await page.route('**/api/escucha-demo/transcribe', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        durationSec: 69,
        transcript: { text: 'discurso de muestra', segments: [{ start: 0, end: 69, text: 'discurso de muestra' }] },
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
          resumen: 'Un discurso de muestra',
          areas: [
            { nombre: 'Área', conceptos: [{ texto: 'Concepto de muestra', citas: [10] }], decisiones: [], tareas: [], riesgos: [], noSeSabe: [] },
          ],
        },
      }),
    })
  );

  await page.goto('/aplicaciones/escuchacomprendiendo-ai');
  await page.getByText('O prueba con un audio de muestra →').click();

  await expect(page.getByText('Concepto de muestra')).toBeVisible();
  await expect(page.getByText('Un discurso de muestra')).toBeVisible();
});

test('formulario de código de acceso: código incorrecto avisa, código correcto redirige a la URL', async ({ page }) => {
  await page.route('**/api/escucha-demo/download', async (route) => {
    const body = route.request().postDataJSON() as { code: string; variant: string };
    if (body.code !== 'clave-correcta') {
      await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'codigo' }) });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, url: '/web#productos?descargado=1' }),
    });
  });

  await page.goto('/aplicaciones/escuchacomprendiendo-ai');
  const input = page.getByPlaceholder('Código de acceso');

  await input.fill('codigo-malo');
  await page.getByRole('button', { name: 'Descargar instalador (Windows)' }).click();
  await expect(page.getByText('Código incorrecto.')).toBeVisible();

  await input.fill('clave-correcta');
  await page.getByRole('button', { name: 'Descargar instalador (Windows)' }).click();
  await page.waitForURL(/descargado=1/);
});
