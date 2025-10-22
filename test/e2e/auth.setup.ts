import { test as setup, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const authFile = path.join(__dirname, '../../playwright/.auth/user.json')

setup('authenticate', async ({ page }) => {
  // Navigate with extended timeout for CI
  await page.goto('/fr/auth/login', {
    waitUntil: 'networkidle'
  })
  await page.waitForURL('/fr/auth/login')

  // Wait for form to be ready
  await expect(page.getByPlaceholder('Entrez votre adresse email')).toBeVisible()

  await page.getByPlaceholder('Entrez votre adresse email').fill('admin@example.com')
  await page.getByPlaceholder('Entrez votre mot de passe').fill('Admin123!')
  await page.getByRole('button', { name: 'Se connecter' }).click()

  await page.waitForURL('/fr')
  await page.context().storageState({ path: authFile })
})
