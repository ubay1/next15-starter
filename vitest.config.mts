import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    exclude: [
      '**/e2e/**', // Pastikan folder e2e di-exclude
      '**/node_modules/**',
      '**/dist/**',
      '**/playwright.config.*',
      '**/*.e2e.{test,spec}.{js,ts}' // Exclude file e2e
    ],
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/unit/setup.ts',
    server: {
      deps: {
        inline: ['@playwright/test']
      }
    }
  },
})