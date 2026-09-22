import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  test: {
    environment: 'node',
    // los smoke E2E corren con Playwright, no con vitest.
    // `.claude/**` es la carpeta de herramientas: está ENLAZADA al arsenal con junctions y trae
    // los tests de las skills (node:test, no vitest) — sin excluirla, `npm test` salía en rojo
    // por archivos que no son del proyecto y tapaba los fallos de verdad (2026-09-22).
    exclude: ['e2e/**', 'node_modules/**', '.claude/**'],
  },
});
