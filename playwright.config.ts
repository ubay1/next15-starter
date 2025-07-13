import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e', // Pastikan hanya mencari di folder e2e
  testMatch: '*.spec.ts', // Gunakan pola nama file yang berbeda
  // Jalankan semua tes secara paralel untuk eksekusi yang lebih cepat
  fullyParallel: true,
  // Cegah penggunaan .only saat menjalankan di CI
  forbidOnly: !!process.env.CI,
  // Ulangi tes yang gagal 2 kali di CI, 0 kali di development
  retries: process.env.CI ? 2 : 0,
  // Gunakan 1 worker di CI untuk penggunaan sumber daya yang dapat diprediksi, tidak terbatas di development
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