import { test, expect } from '@playwright/test'

test('check title page', async ({ page }) => {
  await page.goto('http://localhost:3002/page2')
  await expect(page).toHaveTitle(/Starter Next.js/)
})