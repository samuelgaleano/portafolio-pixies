import { defineConfig, devices } from '@playwright/test';

// Smoke E2E (plan F5-F6 §4): 4 flujos críticos en navegador real. Corren en CI en cada PR.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4123',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npx next start -p 4123',
    url: 'http://localhost:4123',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
