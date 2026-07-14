import { test, expect } from '@playwright/test';

// Capa viva (spec 2026-07-14): marquee, cursor píxel, reloj BOG, statement, footer takeover.

test('marquee: visible en home y estático bajo reduced-motion', async ({ page, browser }) => {
  await page.goto('/');
  const track = page.locator('.marquee-track').first();
  await expect(track).toBeVisible();
  const anim = await track.evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe('marquee-scroll');

  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const p2 = await ctx.newPage();
  await p2.goto('/');
  const anim2 = await p2.locator('.marquee-track').first().evaluate((el) => getComputedStyle(el).animationName);
  expect(anim2).toBe('none');
  await ctx.close();
});

test('cursor píxel: montado con puntero fino, ausente con reduced-motion', async ({ page, browser }) => {
  await page.goto('/');
  await page.mouse.move(600, 400);
  await expect(page.locator('#pixel-cursor')).toHaveClass(/is-on/);
  const bodyCursor = await page.evaluate(() => getComputedStyle(document.body).cursor);
  expect(bodyCursor).toBe('none');

  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const p2 = await ctx.newPage();
  await p2.goto('/');
  await p2.mouse.move(600, 400);
  // el div existe pero nunca se enciende ni roba el cursor nativo
  await expect(p2.locator('#pixel-cursor')).not.toHaveClass(/is-on/);
  expect(await p2.evaluate(() => getComputedStyle(document.body).cursor)).toBe('auto');
  await ctx.close();
});

test('reloj BOG: tickea con formato hh:mm:ss en el footer', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer').getByText(/\d{2}:\d{2}:\d{2}/)).toBeVisible({ timeout: 5000 });
});

test('statement y footer takeover renderizan', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('es la demo')).toBeAttached();
  await expect(page.locator('.footer-wordmark')).toHaveText('PIXIES');
  // los glifos decorativos no contaminan el árbol de accesibilidad
  const hidden = await page.locator('.pixel-glyph').first().getAttribute('aria-hidden');
  expect(hidden).toBe('true');
});
