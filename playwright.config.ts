import { defineConfig, devices } from '@playwright/test';

// Smoke E2E (plan F5-F6 §4): 4 flujos críticos en navegador real. Corren en CI en cada PR.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Tope de workers: con los dos canvas de fondo (ambient + cursor) corriendo rAF en cada
  // página, demasiados navegadores headless en paralelo saturaban la máquina y el test
  // responsive (27 navegaciones) se caía por "browser closed"/timeout. 2 workers = estable.
  workers: 2,
  // el test responsive hace 27 navegaciones en un solo caso: 30s quedaba corto bajo carga
  timeout: 60_000,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4123',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // en CI el build ya corrió como paso previo del workflow — no buildear dos veces
    command: process.env.CI ? 'npx next start -p 4123' : 'npm run build && npx next start -p 4123',
    url: 'http://localhost:4123',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
