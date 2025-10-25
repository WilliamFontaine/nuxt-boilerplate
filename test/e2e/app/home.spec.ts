import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr', { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForURL('/fr')
  })

  test.afterEach(async ({ page }) => {
    await page.close()
  })

  test('should load and display the home page correctly', async ({ page }) => {
    // Check that the page loads without errors
    await expect(page.locator('body')).toBeVisible()

    // Check that UPage component renders (it doesn't use <main>, it's a custom component)
    // Instead, check for actual content that should be visible
    const pageContent = page.locator('[class*="min-h-screen"]').first()
    await expect(pageContent).toBeVisible()

    // Verify that the page has some interactive content
    const buttons = page.locator('button')
    await expect(buttons.first()).toBeVisible()
  })
})
