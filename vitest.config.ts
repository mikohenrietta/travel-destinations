import { defineConfig, configDefaults } from 'vitest/config'


export default defineConfig({
test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    coverage: {
    provider: 'istanbul',   
      reporter: ['text', 'html'], // Output as text and html reports
      include: ['src/**/*.{ts,tsx}'], // Include files to cover
      exclude: ['src/**/*.test.{ts,tsx}', 'node_modules'], // Exclude test files and node_modules
    },
  },
});