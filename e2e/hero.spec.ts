import { test, expect } from '@playwright/test';

// Hero "Píxel vivo" (spec 2026-07-14): el canvas persiste y el h1 queda accesible.

test('hero vivo: el canvas persiste tras el intro y el h1 sigue en el árbol (opacity 0)', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('#wordmark + canvas');
  await expect(canvas).toBeVisible();
  // regresión watchdog: a los 4s el canvas seguía vivo antes de morir por el timeout ciego
  await page.waitForTimeout(4500);
  await expect(canvas).toBeVisible();
  // el h1 real queda con opacity 0 (accesible), nunca visibility/display ocultos
  const style = await page.locator('#wordmark').evaluate((el) => {
    const cs = getComputedStyle(el);
    return { opacity: cs.opacity, visibility: cs.visibility, display: cs.display };
  });
  expect(style).toEqual({ opacity: '0', visibility: 'visible', display: 'block' });
});

test('hero con reduced-motion: h1 estático visible, canvas nunca aparece', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.waitForTimeout(800);
  await expect(page.locator('#wordmark')).toBeVisible();
  await expect(page.locator('#wordmark + canvas')).toBeHidden();
  await ctx.close();
});

test('hero sin JS: el wordmark real queda visible', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('#wordmark')).toBeVisible();
  await ctx.close();
});

test('launcher del portafolio: 6 accesos que saltan a su sección', async ({ page }) => {
  await page.goto('/');
  const links = page.getByRole('navigation', { name: 'Categorías del portafolio' }).getByRole('link');
  await expect(links).toHaveCount(6);
  // clic en un acceso salta a su sección (todas están apiladas y visibles)
  await links.filter({ hasText: 'Sistema ERP' }).click();
  await expect(page.locator('#erp')).toBeInViewport();
});
