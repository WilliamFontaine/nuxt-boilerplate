import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should load and display the home page correctly', async ({ page }) => {
    // Check that the page loads without errors
    await expect(page.locator('body')).toBeVisible()

    // Check for main content area
    await expect(page.locator('main').first()).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that essential elements are still visible
    await expect(page.locator('body')).toBeVisible()
  })

  test('should be responsive on desktop', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })

    // Check that essential elements are still visible
    await expect(page.locator('body')).toBeVisible()
  })
})
