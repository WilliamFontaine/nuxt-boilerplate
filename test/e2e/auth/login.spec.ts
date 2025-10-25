import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/auth/login', { waitUntil: 'networkidle' })
  })

  test.afterEach(async ({ page }) => {
    await page.close()
  })

  test('should display login form with all required fields', async ({ page }) => {
    // Check email field
    const emailInput = page.getByPlaceholder(/adresse email/i)
    await expect(emailInput).toBeVisible()
    await expect(emailInput).toHaveAttribute('type', 'email')

    // Check password field
    const passwordInput = page.getByPlaceholder(/mot de passe/i).first()
    await expect(passwordInput).toBeVisible()
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // Check submit button exists
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toBeEnabled()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByPlaceholder(/adresse email/i).fill('wrong@example.com')
    await page
      .getByPlaceholder(/mot de passe/i)
      .first()
      .fill('wrongpassword')
    await page.locator('button[type="submit"]').click()

    // Should stay on login page
    await expect(page).toHaveURL(/.*\/auth\/login/)
  })

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.getByPlaceholder(/adresse email/i).fill('admin@example.com')
    await page
      .getByPlaceholder(/mot de passe/i)
      .first()
      .fill('Admin123!')
    await page.locator('button[type="submit"]').click()

    // Should redirect to home page
    await page.waitForURL('/fr', { timeout: 10000 })
    await expect(page).toHaveURL('/fr')
  })

  test('should have navigation links', async ({ page }) => {
    // Check register link
    const registerLink = page.locator('a[href*="/auth/register"]')
    await expect(registerLink).toBeVisible()

    // Check forgot password link
    const forgotLink = page.locator('a[href*="/auth/forgot-password"]')
    await expect(forgotLink).toBeVisible()
  })
})
