import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      TURSO_DATABASE_URL: 'file::memory:',
      TURSO_AUTH_TOKEN: '',
    },
  },
});
