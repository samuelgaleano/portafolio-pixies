import { test, expect } from '@playwright/test';

// Red de seguridad responsive: ninguna pantalla puede producir scroll horizontal.
// Nació de un bug real: --text-hero (compartido por el wordmark y el h1 de /samuel)
// se subió a 27vw y desbordó el body en móvil y en /samuel a casi todos los anchos.

const WIDTHS = [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920];
const ROUTES = ['/', '/samuel', '/samuel/posts/hola-mundo-pixies'];

for (const route of ROUTES) {
  test(`sin scroll horizontal en ${route} (9 anchos)`, async ({ page }) => {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(() => {
        const de = document.documentElement;
        return de.scrollWidth - de.clientWidth;
      });
      expect(overflow, `${route} a ${width}px desborda ${overflow}px`).toBeLessThanOrEqual(1);
    }
  });
}

test('el wordmark del hero cabe en su contenedor en todos los anchos', async ({ page }) => {
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const fits = await page.evaluate(() => {
      const h1 = document.getElementById('wordmark')!;
      const box = h1.getBoundingClientRect();
      const parent = h1.closest('div.relative')!.parentElement!.getBoundingClientRect();
      return { w: Math.round(box.width), max: Math.round(parent.width) };
    });
    expect(fits.w, `wordmark ${fits.w}px excede el contenedor ${fits.max}px a ${width}px`).toBeLessThanOrEqual(fits.max);
  }
});
