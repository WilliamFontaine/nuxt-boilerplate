# 🧩 Component Architecture

Vue 3 Composition API components with Nuxt UI Pro v4 integration, following consistent patterns for reusability and maintainability.

## 🏗️ Component Structure

```
app/components/
├── features/
│   └── post/
│       ├── Card.vue         # Display components
│       ├── CreateModal.vue  # Modal components with UAuthForm
│       └── DeleteModal.vue  # Confirmation modals
├── layout/
│   └── PreferencesControls.vue  # Layout utility components
└── ui/
    └── form/               # Reusable form field components
        ├── Input.vue
        ├── Email.vue
        ├── Password.vue
        └── Textarea.vue
```

## 🎯 Component Patterns

### 1. Props & Events Pattern

```vue
<script setup lang="ts">
// Type-safe props
interface Props {
  post: Post
  loading?: boolean
}

const props = defineProps<Props>()

// Type-safe events
const emit = defineEmits<{
  (e: 'delete', post: Post): void
  (e: 'refresh'): void
}>()
</script>
```

### 2. v-model Pattern

```vue
<script setup lang="ts">
// Single v-model
const modelValue = defineModel<string>({ required: true })

// Named v-model
const open = defineModel<boolean>('open', { required: true })
</script>
```

### 3. Composable Integration

```vue
<script setup lang="ts">
const { t } = useI18n()
const { success, error } = useNotifications()
const { state, schema } = usePostForm()
</script>
```

## 🎨 Component Categories

### Display Components

**PostCard.vue** - Card component for displaying posts:

```vue
<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3>{{ post.title }}</h3>
        <div class="flex gap-1">
          <!-- Action buttons with tooltips -->
        </div>
      </div>
    </template>

    <p class="whitespace-pre-wrap leading-relaxed">
      {{ post.content }}
    </p>
  </UCard>
</template>
```

**Features:**

- ✅ **Nuxt UI Pro v4 integration** with UCard, UButton, UDropdownMenu
- ✅ **Overlay system** with useOverlay() for modal management
- ✅ **Consistent styling** with primary/secondary color scheme
- ✅ **Micro-interactions** with hover effects and transitions

### Modal Components

**CreateModal.vue** - Modal for creating/editing posts using Nuxt UI Pro patterns:

```vue
<template>
  <UModal v-model:open="open" :dismissible="!isLoading">
    <template #body>
      <UForm ref="formRef" :state="state" :schema="schema" @submit="handleSubmit">
        <div class="space-y-6">
          <UiFormInput
            v-model="state.title"
            name="title"
            :label="t('articleForm.fields.title.label')"
            required
          />
          <UiFormTextarea
            v-model="state.content"
            name="content"
            :label="t('articleForm.fields.content.label')"
            required
          />
        </div>
      </UForm>
    </template>

    <template #footer>
      <!-- Footer with analytics and action buttons -->
    </template>
  </UModal>
</template>
```

**Features:**

- ✅ **UAuthForm integration** for consistent form patterns
- ✅ **Composable-driven** with usePostForm, useLoginForm, useRegisterForm
- ✅ **Overlay management** with useOverlay() for better UX
- ✅ **Real-time analytics** with character count, word count, reading time

### Form Field Components

**Consistent field pattern:**

```vue
<template>
  <UFormField :label="label" :name="name" :required="required">
    <UInput
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <template #error="{ error }">
      <span class="text-red-400 text-sm">{{ error }}</span>
    </template>
  </UFormField>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string
  label: string
  name: string
  placeholder?: string
  required?: boolean
}>()

defineEmits<(e: 'update:modelValue', value: string) => void>()
</script>
```

## 🎭 Styling Patterns

### Nuxt UI Pro v4 Integration

```vue
<template>
  <!-- Primary colors for main actions -->
  <UButton color="primary" variant="solid" />

  <!-- Red colors for destructive actions -->
  <UButton color="red" variant="solid" />

  <!-- Secondary colors for secondary actions -->
  <UButton color="secondary" variant="outline" />
</template>
```

### Responsive Design

```vue
<template>
  <div class="flex items-center justify-between">
    <!-- Mobile-first approach with responsive utilities -->
    <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
      {{ title }}
    </h3>
  </div>
</template>
```

### Dark Mode Support

```vue
<template>
  <!-- Automatic dark mode with Tailwind -->
  <p class="text-neutral-600 dark:text-neutral-400">
    {{ content }}
  </p>
</template>
```

## 🔧 State Management

### Local State

```vue
<script setup lang="ts">
// Reactive refs for component state
const showModal = ref(false)
const isLoading = ref(false)

// Reactive objects for complex state
const formState = reactive({
  title: '',
  content: ''
})
</script>
```

### Computed Properties

```vue
<script setup lang="ts">
const isValid = computed(() => {
  return formState.title.length > 0 && formState.content.length > 0
})

const buttonLabel = computed(() => {
  return isLoading.value ? t('form.saving') : t('form.save')
})
</script>
```

### Watchers

```vue
<script setup lang="ts">
// Watch props for state updates
watch(
  () => props.post,
  (newPost) => {
    if (newPost) {
      setState(newPost)
    }
  },
  { immediate: true }
)
</script>
```

## 🚀 Best Practices

### Component Organization

1. **Single Responsibility** - Each component has one clear purpose
2. **Composition over Inheritance** - Use composables for shared logic
3. **Props Down, Events Up** - Unidirectional data flow
4. **Type Safety** - Always use TypeScript interfaces

### Performance

1. **Lazy Loading** - Use `defineAsyncComponent` for heavy components
2. **v-memo** - Cache expensive template computations
3. **Computed Caching** - Leverage Vue's computed property caching
4. **Event Cleanup** - Remove event listeners in `onUnmounted`

### Accessibility

1. **Semantic HTML** - Use proper HTML elements
2. **ARIA Labels** - Provide accessible labels
3. **Focus Management** - Handle focus for modals and forms
4. **Color Contrast** - Ensure sufficient contrast ratios

### Testing

1. **Test IDs** - Add `data-testid` for reliable selection
2. **Event Testing** - Test component events and interactions
3. **Snapshot Testing** - Capture component output changes
4. **Integration Testing** - Test component interactions

## 📚 Resources

- [Vue 3 Composition API](https://vuejs.org/api/composition-api-setup.html)
- [Nuxt UI Pro v4 Components](https://ui4.nuxt.com/components)
- [Nuxt UI Pro v4 Auth Components](https://ui4.nuxt.com/docs/components/auth-form)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/overview.html)
- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
