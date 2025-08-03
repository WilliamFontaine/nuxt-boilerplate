# 🧪 Testing Architecture

Comprehensive testing strategy using Vitest for unit tests and Playwright for E2E testing with proper test isolation.

## 🏗️ Testing Structure

```
tests/
├── setup/
│   ├── vitest.ts           # Vitest configuration
│   └── playwright.ts       # Playwright configuration
├── unit/
│   ├── components/         # Component tests
│   ├── composables/        # Composable tests
│   └── stores/             # Store tests
└── e2e/
    ├── auth.spec.ts        # Authentication flows
    ├── home.spec.ts        # Home page functionality
    └── posts.spec.ts       # Post management
```

## 🔧 Vitest Configuration

### Test Setup

```typescript
// tests/setup/vitest.ts
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock Nuxt composables
vi.mock('#imports', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: { value: 'en' }
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn()
  }),
  navigateTo: vi.fn()
}))

// Global test configuration
config.global.plugins = []
```

### Component Testing

```typescript
// tests/unit/components/LanguageSwitcher.nuxt.spec.ts
import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import LanguageSwitcher from '~/components/layout/LanguageSwitcher.vue'

test('renders language options', () => {
  const wrapper = mount(LanguageSwitcher)

  expect(wrapper.find('[data-testid="language-fr"]').exists()).toBe(true)
  expect(wrapper.find('[data-testid="language-en"]').exists()).toBe(true)
})
```

### Composable Testing

```typescript
// tests/unit/composables/usePostForm.spec.ts
import { describe, it, expect } from 'vitest'
import { usePostForm } from '~/composables/forms/usePostForm'

describe('usePostForm', () => {
  it('should initialize with empty state', () => {
    const { state } = usePostForm()

    expect(state.title).toBe('')
    expect(state.content).toBe('')
  })

  it('should validate required fields', async () => {
    const { validate, state } = usePostForm()

    state.title = ''
    const { isValid } = await validate()

    expect(isValid).toBe(false)
  })
})
```

### Store Testing

```typescript
// tests/unit/stores/preferences.spec.ts
import { createPinia, setActivePinia } from 'pinia'
import { describe, beforeEach, it, expect } from 'vitest'
import { usePreferencesStore } from '~/stores/usePreferences'

describe('PreferencesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should set view mode', () => {
    const store = usePreferencesStore()
    store.setPostViewMode('grid')
    expect(store.postViewMode).toBe('grid')
  })
})
```

## 🎭 Playwright E2E Testing

### Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
})
```

### Authentication Testing

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should register new user', async ({ page }) => {
    await page.goto('/auth/register')

    await page.fill('[data-testid="name-input"]', 'John Doe')
    await page.fill('[data-testid="email-input"]', 'john@example.com')
    await page.fill('[data-testid="password-input"]', 'SecurePass123')
    await page.fill('[data-testid="confirm-password-input"]', 'SecurePass123')

    await page.click('[data-testid="register-button"]')

    await expect(page).toHaveURL('/')
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('should login existing user', async ({ page }) => {
    await page.goto('/auth/login')

    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password')

    await page.click('[data-testid="login-button"]')

    await expect(page).toHaveURL('/')
  })
})
```

### API Testing

```typescript
// tests/e2e/api.spec.ts
import { test, expect } from '@playwright/test'

test.describe('API Routes', () => {
  test('should require authentication for protected routes', async ({ request }) => {
    const response = await request.post('/api/posts', {
      data: { title: 'Test', content: 'Content' }
    })

    expect(response.status()).toBe(401)
  })

  test('should allow access to public routes', async ({ request }) => {
    const response = await request.get('/api/posts')

    expect(response.status()).toBe(200)
  })
})
```

## 🔧 Test Utilities

### Page Object Model

```typescript
// tests/utils/pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/auth/login')
  }

  async fillCredentials(email: string, password: string) {
    await this.page.fill('[data-testid="email-input"]', email)
    await this.page.fill('[data-testid="password-input"]', password)
  }

  async submit() {
    await this.page.click('[data-testid="login-button"]')
  }

  async login(email: string, password: string) {
    await this.goto()
    await this.fillCredentials(email, password)
    await this.submit()
  }
}
```

### Test Data Factory

```typescript
// tests/utils/factories/user.ts
export const createUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})
```

### Database Helpers

```typescript
// tests/utils/database.ts
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export const resetTestDatabase = async () => {
  await execAsync('npx prisma migrate reset --force --skip-seed')
}

export const seedTestData = async () => {
  await execAsync('npx prisma db seed')
}
```

## 🗄️ Database Testing

### Test Database Isolation

```typescript
// tests/setup/database.ts
import { beforeAll, afterAll } from 'vitest'

beforeAll(async () => {
  // Switch to test database
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
  await resetTestDatabase()
})

afterAll(async () => {
  // Cleanup after tests
  await resetTestDatabase()
})
```

### Transaction Rollback Pattern

```typescript
// tests/unit/api/posts.spec.ts
import { test, expect } from 'vitest'
import prisma from '@@/lib/prisma'

test('should create post', async () => {
  await prisma
    .$transaction(async (tx) => {
      const post = await tx.post.create({
        data: { title: 'Test', content: 'Content', authorId: 1 }
      })

      expect(post.title).toBe('Test')

      // Transaction automatically rolls back
      throw new Error('Rollback')
    })
    .catch(() => {
      // Expected rollback
    })
})
```

## 🎯 Testing Best Practices

### Test Organization

1. **Arrange-Act-Assert** pattern for clarity
2. **Descriptive test names** that explain behavior
3. **Single assertion** per test when possible
4. **Test isolation** with proper setup/teardown

### Component Testing

1. **Test behavior, not implementation**
2. **Use data-testid** for reliable element selection
3. **Mock external dependencies**
4. **Test user interactions**

### E2E Testing

1. **Test critical user journeys**
2. **Use Page Object Model** for maintainability
3. **Test across multiple browsers**
4. **Include accessibility testing**

### Performance Testing

```typescript
// tests/e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

test('should load home page within 2 seconds', async ({ page }) => {
  const startTime = Date.now()
  await page.goto('/')
  const loadTime = Date.now() - startTime

  expect(loadTime).toBeLessThan(2000)
})
```

## 📊 Test Coverage

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      exclude: ['node_modules/', 'tests/', '.nuxt/', 'coverage/'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

### Running Tests

```bash
# Unit tests
npm run test:unit              # Run unit tests
npm run test:unit:watch        # Watch mode
npm run test:unit:coverage     # With coverage

# E2E tests
npm run test:e2e               # Run E2E tests
npm run test:e2e:ui            # Interactive mode
npm run test:e2e:debug         # Debug mode

# All tests
npm test                       # Run all tests
```

## 🔍 Debugging Tests

### Vitest Debugging

```typescript
// Add debugging to tests
import { vi } from 'vitest'

test('should debug test', () => {
  const mockFn = vi.fn()

  // Debug function calls
  console.log('Mock calls:', mockFn.mock.calls)

  // Debug component state
  const wrapper = mount(Component)
  console.log('Component HTML:', wrapper.html())
})
```

### Playwright Debugging

```bash
# Debug mode with browser UI
npx playwright test --debug

# Headed mode
npx playwright test --headed

# Trace viewer
npx playwright show-trace trace.zip
```

## 📚 Testing Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Vue Test Utils](https://vue-test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/)
