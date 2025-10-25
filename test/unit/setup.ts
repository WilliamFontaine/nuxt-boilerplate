import { vi } from 'vitest'
import { ref, reactive } from 'vue'

// Mock console.warn to suppress Vue warnings during tests
// eslint-disable-next-line no-console
const originalWarn = console.warn
// eslint-disable-next-line no-console
console.warn = (message: string, ...args: any[]) => {
  if (
    message.includes('injection "Symbol(nuxt-ui.') ||
    message.includes('Symbol(nuxt-ui.') ||
    message.includes('Missing required prop:')
  ) {
    return
  }
  originalWarn(message, ...args)
}

// Global mocks for all tests using standard vi.mock
vi.mock('#app', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: ref('fr'),
    locales: ref([
      { code: 'fr', name: 'Français' },
      { code: 'en', name: 'English' }
    ]),
    setLocale: vi.fn(),
    switchLocalePath: vi.fn((path: string) => path)
  }),
  useColorMode: () => ({
    value: 'light',
    preference: 'light',
    system: 'light',
    unknown: false
  }),
  useRouter: () => ({
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
  }),
  useRoute: () =>
    reactive({
      path: '/',
      name: 'index',
      params: {},
      query: {},
      meta: {}
    })
}))

// Mock Nuxt auto-imports as globals
global.useI18n = () => ({
  t: (key: string) => key,
  locale: ref('fr'),
  locales: ref([
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' }
  ]),
  setLocale: vi.fn(),
  switchLocalePath: vi.fn((path: string) => path)
})

global.useColorMode = () => ({
  value: 'light',
  preference: 'light',
  system: 'light',
  unknown: false
})

global.useRouter = () => ({
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
})

global.useRoute = () =>
  reactive({
    path: '/',
    name: 'index',
    params: {},
    query: {},
    meta: {}
  })
