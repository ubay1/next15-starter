import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e', // Pastikan hanya mencari di folder e2e
  testMatch: '*.spec.ts', // Gunakan pola nama file yang berbeda
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev', // Pastikan ini menjalankan Vite dev server
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
  },
})