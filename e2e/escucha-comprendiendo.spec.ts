import { test, expect } from '@playwright/test';

// escuchacomprendiendo.IA: en /web hay una tarjeta-teaser clicable dentro de la sección
// DIRECTA "Aplicaciones · by Pixies" (2026-09-23: se sacó del portafolio, donde quedaba
// demasiado abajo); TODO lo interactivo vive en /aplicaciones/escuchacomprendiendo-ai. El
// ejemplo curado todavía no está listo, así que esa página va directa a la demo en vivo y
// NO muestra una pestaña "Ejemplo real" que prometa contenido inexistente.

test('/web: la ficha de la app es una ficha de tienda con descarga y prueba', async ({ page }) => {
  // 2026-09-23: la sección vive arriba, justo bajo el hero de /web y bajo el catálogo, con la
  // misma ancla `#productos`. Y la tarjeta dejó de ser un enlace estirado: ahora es una FICHA
  // tipo tienda, con su propio botón de descarga y otro de probar — que es lo que Samuel pidió
  // ("un recuadro tipo App Store, enfocado a las descargas").
  await page.goto('/web');
  const seccion = page.locator('#productos');
  await expect(seccion.getByRole('heading', { name: 'Aplicaciones' })).toBeVisible();
  await expect(seccion.getByText('by Pixies')).toBeVisible();

  // identidad de tienda: nombre, quién la hace y la ficha técnica
  await expect(seccion.locator('.app-ficha__nombre')).toHaveText('escuchacomprendiendo.IA');
  await expect(seccion.locator('.app-ficha__dev')).toHaveText('Pixies Design Group');
  await expect(seccion.locator('.app-ficha__meta dd').first()).toHaveText('1.0.1');
  // NO hay estrellas ni contador de descargas: no los tenemos y no se inventan
  await expect(seccion.locator('.app-ficha__meta dd')).toHaveCount(3);

  // la sección no despliega el demo: eso vive en la página de la app
  await expect(seccion.getByRole('tab')).toHaveCount(0);
  await expect(seccion.locator('input[type="file"]')).toHaveCount(0);

  // los dos botones llevan a la app
  const botones = seccion.locator('.app-ficha__btn');
  await expect(botones).toHaveCount(2);
  for (const b of await botones.all()) {
    await expect(b).toHaveAttribute('href', '/aplicaciones/escuchacomprendiendo-ai');
  }
  await botones.first().click();
  await expect(page).toHaveURL(/\/aplicaciones\/escuchacomprendiendo-ai$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('escuchacomprendiendo.IA');
});

test('al entrar: explicación concreta, condiciones desplegables y la demo lista para usar', async ({ page }) => {
  await page.goto('/aplicaciones/escuchacomprendiendo-ai');

  // la explicación va ANTES de la demo y son exactamente tres puntos, no dos párrafos largos
  const puntos = page.locator('.escucha-intro__punto');
  await expect(puntos).toHaveCount(3);
  await expect(puntos.first()).toContainText('No se queda en transcribir');

  // las condiciones de la demo existen, arrancan plegadas y dicen qué procesa de menos
  const condiciones = page.locator('.escucha-condiciones');
  await expect(condiciones).not.toHaveAttribute('open', '');
  await condiciones.locator('summary').click();
  await expect(condiciones.getByText(/90 segundos/)).toBeVisible();

  // sin ejemplo curado NO se ofrece una pestaña que prometa uno: se cae directo en la demo
  await expect(page.getByRole('tab', { name: 'Ejemplo real' })).toBeHidden();
  await expect(page.getByText('Suelta o elige un audio corto')).toBeVisible();
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

// El valor agregado que Samuel pidió mostrar (2026-09-23): el resultado no se queda en
// "transcribe y resume". Se comprueba que aparezca la carcasa tipo app de escritorio, que la
// vista por defecto sea el GRAFO cuando lo hay, que la transcripción quede relegada a su
// pestaña, y que lo deducido o dudoso salga marcado en vez de presentarse como un hecho.
test('el resultado se muestra como la app: grafo por defecto, contexto marcado y transcripción al final', async ({ page }) => {
  await page.route('**/api/escucha-demo/transcribe', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        durationSec: 40,
        transcript: { text: 'texto crudo del transcriptor', segments: [{ start: 0, end: 40, text: 'texto crudo del transcriptor' }] },
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
          resumen: 'Revisión de presupuesto',
          areas: [
            {
              nombre: 'Presupuesto',
              conceptos: [{ texto: 'Se revisa contra el margen', citas: [0], certeza: 'afirmado' }],
              decisiones: [],
              tareas: [{ texto: 'Confirmar con el contador', citas: [0], certeza: 'implicito' }],
              riesgos: [{ texto: 'Puede bajar el volumen', citas: [0], certeza: 'incierto' }],
              noSeSabe: [],
            },
          ],
          // etiquetas largas A PROPÓSITO: con el lienzo estrecho original se salían del
          // viewBox y se veían cortadas contra el borde (capturado en producción, 2026-09-23)
          nodos: [
            { id: 'n1', etiqueta: 'Presupuesto del trimestre', tipo: 'concepto' },
            { id: 'n2', etiqueta: 'Contador de la empresa', tipo: 'persona' },
            { id: 'n3', etiqueta: 'Explotación petrolera extranjera', tipo: 'concepto' },
          ],
          vinculos: [
            { de: 'n1', a: 'n2', relacion: 'depende de' },
            { de: 'n1', a: 'n3', relacion: 'limita' },
          ],
        },
      }),
    })
  );

  await page.goto('/aplicaciones/escuchacomprendiendo-ai');
  await page.getByText('O prueba con un audio de muestra →').click();

  // carcasa de aplicación, con el proyecto y las notas del audio en el panel lateral
  const shell = page.locator('.app-shell');
  await expect(shell).toBeVisible();
  await expect(shell.getByText('Presupuesto').first()).toBeVisible();

  // el grafo manda: es la pestaña activa al llegar
  await expect(page.getByRole('tab', { name: 'Grafo' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.escucha-grafo__relaciones li')).toHaveCount(2);
  await expect(page.getByText('depende de')).toBeVisible();

  // ninguna etiqueta puede salirse del lienzo: las de los lados se escriben hacia afuera
  const desbordadas = await page.evaluate(() => {
    const svg = document.querySelector('.escucha-grafo__svg') as SVGSVGElement | null;
    if (!svg) return ['sin svg'];
    const ancho = svg.viewBox.baseVal.width;
    return [...svg.querySelectorAll('text')]
      .filter((t) => {
        const b = (t as SVGTextElement).getBBox();
        return b.x < 0 || b.x + b.width > ancho;
      })
      .map((t) => t.textContent ?? '');
  });
  expect(desbordadas).toEqual([]);

  // lo deducido y lo dudoso van marcados; lo afirmado no lleva etiqueta (sería ruido)
  await page.getByRole('tab', { name: 'Contexto' }).click();
  // se filtra por la clase: "lo que quedó en duda" también aparece en el texto de la
  // introducción, y un getByText suelto haría match doble
  await expect(page.locator('.certeza--implicito')).toHaveText('deducido');
  await expect(page.locator('.certeza--incierto')).toHaveText('quedó en duda');
  await expect(page.locator('.certeza')).toHaveCount(2);

  // la transcripción existe, pero relegada a su pestaña y avisando que no es el resultado
  await page.getByRole('tab', { name: 'Transcripción' }).click();
  await expect(page.getByText('texto crudo del transcriptor')).toBeVisible();
  await expect(page.getByText(/Es la materia prima, no el resultado/)).toBeVisible();
});

// Auditoría SEO 2026-09-24: la página del producto no llevaba NINGÚN structured data. Se usa
// el navegador real (no fetch/curl) a propósito — el skill de auditoría SEO del arsenal
// advierte que ese JSON-LD lo inyecta React en el cliente y curl nunca lo vería.
test('la página de la app lleva SoftwareApplication en JSON-LD, sin rating inventado', async ({ page }) => {
  await page.goto('/aplicaciones/escuchacomprendiendo-ai');
  const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
  const app = bloques.map((b) => JSON.parse(b)).find((d) => d['@type'] === 'SoftwareApplication');
  expect(app).toBeTruthy();
  expect(app.name).toBe('escuchacomprendiendo.IA');
  expect(app.operatingSystem).toBe('Windows');
  expect(app.offers).toMatchObject({ price: '0' });
  // nada de estrellas ni descargas inventadas: no existen y no se declaran
  expect(app.aggregateRating).toBeUndefined();

  // el <title> de la pestaña cabe en un resultado de búsqueda sin truncarse a mitad de frase
  const title = await page.title();
  expect(title.length).toBeLessThanOrEqual(60);
});
