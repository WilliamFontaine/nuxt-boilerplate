import { vi } from 'vitest'
import { ref, reactive } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

// Mock console.warn to suppress Vue warnings during tests
// eslint-disable-next-line no-console
const originalWarn = console.warn
// eslint-disable-next-line no-console
console.warn = (message: string, ...args: any[]) => {
  // Suppress Nuxt UI injection context warnings
  if (message.includes('injection "Symbol(nuxt-ui.') || message.includes('Symbol(nuxt-ui.')) {
    return
  }
  originalWarn(message, ...args)
}

// Global mocks for all tests
mockNuxtImport('useI18n', () => () => ({
  t: (key: string) => key,
  locale: ref('fr'),
  locales: ref([
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' }
  ]),
  setLocale: vi.fn(),
  switchLocalePath: vi.fn((path: string) => path)
}))

mockNuxtImport('useColorMode', () => () => ({
  value: 'light',
  preference: 'light',
  system: 'light',
  unknown: false
}))

mockNuxtImport('useRouter', () => () => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  beforeEach: vi.fn(),
  afterEach: vi.fn(),
  beforeResolve: vi.fn(),
  onError: vi.fn(),
  isReady: vi.fn(() => Promise.resolve()),
  currentRoute: ref({
    path: '/',
    name: 'index',
    params: {},
    query: {},
    meta: {}
  })
}))

mockNuxtImport(
  'useRoute',
  () => () =>
    reactive({
      path: '/',
      name: 'index',
      params: {},
      query: {},
      meta: {}
    })
)

mockNuxtImport('useNotifications', () => () => ({
  addNotification: vi.fn(),
  removeNotification: vi.fn(),
  notifications: ref([])
}))
