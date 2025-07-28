# Pinia State Management Patterns

This document outlines the Pinia state management patterns used in this Nuxt 4 project.

## Store Architecture

### Store Definition Pattern

```typescript
// app/stores/usePreferences.ts
export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    postViewMode: 'list' as PostViewMode,
    postDisplayMode: 'compact' as PostDisplayMode
  }),
  actions: {
    setPostViewMode(mode: PostViewMode) {
      this.postViewMode = mode
    },
    setPostDisplayMode(mode: PostDisplayMode) {
      this.postDisplayMode = mode
    },
    resetPreferences() {
      this.postViewMode = 'list'
      this.postDisplayMode = 'compact'
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })
  }
})
```

### Composable Wrapper Pattern

```typescript
// app/composables/usePreferences.ts
export const usePreferences = () => {
  const store = usePreferencesStore()
  return {
    postViewMode: toRef(store, 'postViewMode'),
    postDisplayMode: toRef(store, 'postDisplayMode'),
    setPostViewMode: store.setPostViewMode,
    setPostDisplayMode: store.setPostDisplayMode,
    resetPreferences: store.resetPreferences
  }
}
```

## Persistent State with Cookies

### Configuration

The project uses `@pinia-plugin-persistedstate/nuxt` for automatic state persistence:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt']
})
```

### Cookie Storage Options

```typescript
persist: {
  storage: piniaPluginPersistedstate.cookies({
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    secure: true, // HTTPS only in production
    sameSite: 'lax' // CSRF protection
  })
}
```

## Usage in Components

### Template Usage

```vue
<template>
  <UButtonGroup>
    <UButton
      :variant="postViewMode === 'list' ? 'solid' : 'outline'"
      @click="setPostViewMode('list')"
    >
      {{ t('preferences.displayMode.list') }}
    </UButton>
    <UButton
      :variant="postViewMode === 'grid' ? 'solid' : 'outline'"
      @click="setPostViewMode('grid')"
    >
      {{ t('preferences.displayMode.grid') }}
    </UButton>
  </UButtonGroup>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { postViewMode, setPostViewMode } = usePreferences()
</script>
```

## Type Safety

### Store Types

```typescript
// shared/types/preferences.ts
export type PostViewMode = 'list' | 'grid'
export type PostDisplayMode = 'compact' | 'extended'
```

### Store State Typing

```typescript
interface PreferencesState {
  postViewMode: PostViewMode
  postDisplayMode: PostDisplayMode
}
```

## Best Practices

### Store Organization

- One store per domain/feature
- Keep stores focused and cohesive
- Use descriptive store names with `use` prefix

### Action Patterns

- Prefer explicit actions over direct state mutation
- Use meaningful action names that describe intent
- Keep actions simple and focused

### Composable Benefits

- Clean separation between store and component logic
- Easier testing and mocking
- Consistent API across components
- Better TypeScript inference

### Persistence Strategy

- Use cookies for user preferences (7-day expiration)
- Consider localStorage for larger data sets
- Use sessionStorage for temporary state
- Implement proper error handling for storage failures

## Testing Patterns

### Store Testing

```typescript
// tests/unit/stores/preferences.test.ts
import { createPinia, setActivePinia } from 'pinia'
import { usePreferencesStore } from '~/stores/usePreferences'

describe('PreferencesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('should set view mode', () => {
    const store = usePreferencesStore()
    store.setPostViewMode('grid')
    expect(store.postViewMode).toBe('grid')
  })
})
```

### Component Testing with Stores

```typescript
// Use mock stores in component tests
const mockStore = {
  postViewMode: ref('list'),
  setPostViewMode: vi.fn()
}

vi.mock('~/composables/usePreferences', () => ({
  usePreferences: () => mockStore
}))
```
