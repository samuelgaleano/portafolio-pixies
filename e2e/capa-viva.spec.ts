import { test, expect } from '@playwright/test';

// Capa viva (spec 2026-07-14): reloj BOG, statement, footer takeover.
// (El marquee y la estela de cursor se retiraron; sus tests se eliminaron.)

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
