import { test, expect } from '@playwright/test'

test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/auth/register', { waitUntil: 'networkidle' })
  })

  test.afterEach(async ({ page }) => {
    await page.close()
  })

  test('should display registration form with all required fields', async ({ page }) => {
    // Check name field
    const nameInput = page.getByPlaceholder(/nom/i)
    await expect(nameInput).toBeVisible()

    // Check email field
    const emailInput = page.getByPlaceholder(/adresse email/i)
    await expect(emailInput).toBeVisible()

    // Check password fields (should have 2: password and confirm)
    const passwordFields = page.getByPlaceholder(/mot de passe/i)
    const count = await passwordFields.count()
    expect(count).toBeGreaterThanOrEqual(2)

    // Check submit button
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('should have navigation link to login page', async ({ page }) => {
    const loginLink = page.locator('a[href*="/auth/login"]')
    await expect(loginLink).toBeVisible()
  })
})
