import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    testTimeout: 15000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@web': path.resolve(__dirname, './apps/web/src'),
      'cloudflare:workers': path.resolve(__dirname, './tests/mocks/cloudflare-workers.ts'),
    },
  },
});
