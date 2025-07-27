import { test, expect } from '@playwright/test'

test.describe('Swagger Protection in Production', () => {
  test('should return 403 for /api/docs endpoint in production', async ({ page }) => {
    // Ce test nécessite que l'app soit buildée en production
    // Pour le moment, on teste la logique avec un mock

    const response = await page.goto('/api/docs')

    // En développement, ça devrait marcher
    // En production (si testé avec NODE_ENV=production), ça devrait échouer
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
    // Aller sur Swagger UI (en dev)
    await page.goto('/api/docs/ui')

    // Attendre que Swagger UI se charge
    await page.waitForSelector('.swagger-ui')

    // Vérifier que les endpoints /api/docs n'apparaissent pas dans la liste
    // Utiliser un sélecteur plus spécifique pour éviter les problèmes de regex
    const docsEndpoint = page.locator('.opblock-summary-path').filter({ hasText: '/api/docs' })
    await expect(docsEndpoint).toHaveCount(0)

    // Vérifier aussi qu'on ne trouve pas le texte "/api/docs" dans les chemins d'API
    const operationBlocks = page.locator('.opblock')
    await expect(operationBlocks).toContainText(['/api/posts'])

    // S'assurer qu'aucun opblock ne contient "/api/docs"
    const allOperationTexts = await operationBlocks.allTextContents()
    const hasDocsEndpoint = allOperationTexts.some((text) => text.includes('/api/docs'))
    expect(hasDocsEndpoint).toBe(false)
  })
})
