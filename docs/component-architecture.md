# 🧩 Component Architecture

Vue 3 Composition API components with Nuxt UI integration, following consistent patterns for reusability and maintainability.

## 🏗️ Component Structure

```
app/components/
├── EditPostModal.vue        # Modal components for editing
├── PostCard.vue             # Display components
├── LanguageSwitcher.vue     # Utility components
├── ThemeSwitcher.vue        # Utility components
└── form/                    # Form components
    ├── Post.vue             # Complete form components
    └── field/               # Reusable field components
        ├── Input.vue
        ├── Password.vue
        ├── Select.vue
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

- ✅ **Nuxt UI integration** with UCard, UButton, UTooltip
- ✅ **Action buttons** with accessibility tooltips
- ✅ **Content formatting** with whitespace preservation
- ✅ **Event emission** for parent interaction

### Modal Components

**EditPostModal.vue** - Modal for editing posts:

```vue
<template>
  <UModal v-model:open="open" :dismissible="!loading">
    <template #body>
      <UForm :state="state" :schema="schema">
        <!-- Form fields -->
      </UForm>
    </template>

    <template #footer="{ close }">
      <!-- Action buttons -->
    </template>
  </UModal>
</template>
```

**Features:**

- ✅ **Form integration** with validation
- ✅ **Loading states** with disabled interactions
- ✅ **Auto-population** from props via watchers
- ✅ **Success/error notifications**

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

### Nuxt UI Integration

```vue
<template>
  <!-- Primary colors for main actions -->
  <UButton color="primary" variant="solid" />

  <!-- Error colors for destructive actions -->
  <UButton color="error" variant="ghost" />

  <!-- Neutral colors for secondary actions -->
  <UButton color="neutral" variant="outline" />
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
- [Nuxt UI Components](https://ui.nuxt.com/components)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/overview.html)
- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
