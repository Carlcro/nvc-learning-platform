import { defineConfig } from 'vitest/config'

// Deliberately separate from vite.config.ts: the app config loads the
// Cloudflare and TanStack Start plugins, which the pure logic under test does
// not need and which cannot run in a plain node environment.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['convex/**/*.test.ts', 'src/**/*.test.ts'],
  },
})
