import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  test: {
    environment: 'node',
    // los smoke E2E corren con Playwright, no con vitest
    exclude: ['e2e/**', 'node_modules/**'],
  },
});
