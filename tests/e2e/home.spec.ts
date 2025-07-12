import { test, expect } from '@playwright/test'

test('check title page', async ({ page }) => {
  await page.goto('http://localhost:3002')
  await expect(page).toHaveTitle(/Starter Next.js/)
})

test('check error message', async ({ page }) => {
  await page.goto('http://localhost:3002')
  await page.getByTestId('home-example-form-input').fill("")
  await page.getByTestId('home-example-btn-submit').click()
  await expect(page.getByTestId("home-example-error-msg")).toContainText("Username must be at least 3 characters long");
})

test('check greeting message', async ({ page }) => {
  await page.goto('http://localhost:3002')
  await page.getByTestId('home-example-form-input').fill("ubay")
  await page.getByTestId('home-example-btn-submit').click()
  await expect(page.getByTestId("home-example-username")).toContainText("Hallo ubay");
})

test('goto page 2', async ({ page }) => {
  await page.goto('http://localhost:3002')
  await page.getByTestId('btn-goto-page2').click()
  await expect(page).toHaveURL("http://localhost:3002/page2")
  await expect(page.getByTestId("heading-greet")).toContainText("this is page 2");
})