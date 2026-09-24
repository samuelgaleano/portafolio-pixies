import { test, expect } from '@playwright/test';

// escuchacomprendiendo.IA: en /web hay una tarjeta-teaser clicable dentro de la sección
// DIRECTA "Aplicaciones · by Pixies" (2026-09-23: se sacó del portafolio, donde quedaba
// demasiado abajo); TODO lo interactivo vive en /aplicaciones/escuchacomprendiendo-ai. El
// ejemplo curado todavía no está listo, así que esa página va directa a la demo en vivo y
// NO muestra una pestaña "Ejemplo real" que prometa contenido inexistente.

test('home: la tarjeta de la app es un teaser entero clicable que lleva a su página propia', async ({ page }) => {
  // 2026-09-23: la sección ya no vive dentro del portafolio — está arriba, justo bajo el
  // hero de /web, con la misma ancla `#productos`.
  // Sin el ancla `#productos` a propósito: entrar por hash dispara el `scroll-behavior:
  // smooth` del sitio y ese desplazamiento sigue corriendo mientras se calcula el punto del
  // clic. Lo que se prueba aquí es que la tarjeta entera sea oprimible, no el salto al ancla.
  await page.goto('/web');
  const seccion = page.locator('#productos');
  await expect(seccion.getByRole('heading', { name: 'Aplicaciones' })).toBeVisible();
  await expect(seccion.getByText('by Pixies')).toBeVisible();
  await expect(seccion.locator('.app-card__nombre')).toHaveText('escuchacomprendiendo.IA');
  // la home NO despliega el demo: ni pestañas ni dropzone acá
  await expect(seccion.getByRole('tab')).toHaveCount(0);
  await expect(seccion.locator('input[type="file"]')).toHaveCount(0);

  // la tarjeta entera es un link estirado (mismo patrón que ProjectCard) → navega a la app.
  // Antes de oprimir hay que esperar a que la tarjeta DEJE DE MOVERSE: la página se sigue
  // acomodando un buen rato (swap de fuentes y reveals), y un punto calculado antes de que
  // pare cae fuera de la tarjeta — falló 2 de 6 veces hasta que se comprobó con
  // elementFromPoint. Con la espera: 8 de 8 (2026-09-22).
  const tarjeta = seccion.getByRole('link', { name: /escuchacomprendiendo\.IA — probar en vivo o descargar/ });
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
