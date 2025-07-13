import { test, expect } from '@playwright/test'

test.describe('Dattebayo API', () => {
  test('GET - List All Character Naruto', async ({ page }) => {
    await page.goto('http://localhost:3002/page2')
    const response = await page.request.get('https://dattebayo-api.onrender.com/characters')

    // Check response status code
    const responseCode = response.status()
    expect(responseCode).toBe(200)

    // Alternative ways to check status code
    // expect(response.ok()).toBeTruthy() // Checks if status is in 200-299 range
    // expect(response).toBeOK() // Playwright's built-in matcher for 200-299 status
  })
})