import process from "node:process";
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "*.spec.ts",
  fullyParallel: true,

  /* Timeout per test */
  timeout: 30 * 1000,

  expect: {
    timeout: 5000,
  },

  /* Fail kalau ada test.only */
  forbidOnly: !!process.env.CI,

  /* Retry di CI biar nggak flaky */
  retries: process.env.CI ? 2 : 0,

  /* Biar stabil, worker cuma 1 di CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter */
  reporter: process.env.CI ? "dot" : "html",

  use: {
    actionTimeout: 0,
    baseURL: process.env.CI ? "http://localhost:3000" : "http://localhost:3002",

    trace: process.env.CI ? "retain-on-failure" : "on-first-retry",

    /* Headless wajib true di CI */
    headless: true,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Kalau nggak butuh semua browser, matiin aja biar CI lebih cepat:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  webServer: {
    command: process.env.CI ? "npm run preview" : "npm run dev",
    port: process.env.CI ? 3000 : 3002,
    reuseExistingServer: !process.env.CI,
    timeout: 500 * 1000, // kasih waktu 1 menit server start di CI
  },
});
