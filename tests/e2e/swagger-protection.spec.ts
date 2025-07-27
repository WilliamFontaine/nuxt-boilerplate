import { test, expect } from '@playwright/test'

test.describe('Swagger Protection in Production', () => {
  test('should return 403 for /api/docs endpoint in production', async ({ page }) => {
    // This test requires the app to be built in production
    // For now, we test the logic with a mock

    const response = await page.goto('/api/docs')

    // In development, it should work
    // In production (if tested with NODE_ENV=production), it should fail
    if (process.env.NODE_ENV === 'production') {
      expect(response?.status()).toBe(403)
    } else {
      expect(response?.status()).toBe(200)
    }
  })

  test('should return 403 for /api/docs/ui endpoint in production', async ({ page }) => {
    const response = await page.goto('/api/docs/ui')

    if (process.env.NODE_ENV === 'production') {
      expect(response?.status()).toBe(403)
    } else {
      expect(response?.status()).toBe(200)
    }
  })

  test('should not show documentation endpoints in Swagger UI', async ({ page }) => {
    // Go to Swagger UI (in dev)
    await page.goto('/api/docs/ui')

    // Wait for Swagger UI to load
    await page.waitForSelector('.swagger-ui')

    // Verify that /api/docs endpoints don't appear in the list
    // Use a more specific selector to avoid regex issues
    const docsEndpoint = page.locator('.opblock-summary-path').filter({ hasText: '/api/docs' })
    await expect(docsEndpoint).toHaveCount(0)

    // Also verify that we don't find the text "/api/docs" in API paths
    const operationBlocks = page.locator('.opblock')
    await expect(operationBlocks).toContainText(['/api/posts'])

    // Ensure no opblock contains "/api/docs"
    const allOperationTexts = await operationBlocks.allTextContents()
    const hasDocsEndpoint = allOperationTexts.some((text) => text.includes('/api/docs'))
    expect(hasDocsEndpoint).toBe(false)
  })
})
