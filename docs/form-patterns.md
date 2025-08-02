# 📝 Advanced Form Patterns

Deep dive into form architecture, custom validation, and field composition patterns.

## 🧠 Reactive State Architecture

## 🔧 Core Composables

### `usePostForm`

Manages form state, validation, and submission logic for posts:

```typescript
const { state, setState, resetState, isValid, validate } = usePostForm()

// Reactive state
state.title = 'My Post'
state.content = 'Post content...'

// Validation
const { isValid, errors } = await validate()

// State management
setState({ title: 'Updated' })
resetState()
```

**Features:**

- ✅ Reactive state management
- ✅ Zod schema validation with i18n
- ✅ Computed validation status
- ✅ State reset/update utilities

## 🎨 Field Components

### Base Pattern

All field components follow this pattern:

```vue
<template>
  <UFormGroup :label="label" :error="error">
    <UInput v-model="model" :placeholder="placeholder" />
  </UFormGroup>
</template>

<script setup lang="ts">
const { t } = useI18n()

interface Props {
  label: string
  placeholder?: string
  error?: string
}

const model = defineModel<string>({ required: true })
</script>
```

### Available Fields

- **`Input`** - Basic text input
- **`Password`** - Password field with toggle
- **`Textarea`** - Multi-line text input
- **`Select`** - Dropdown selection

## 📏 Validation System

### Schema Definition

Forms use Zod schemas with i18n integration:

```typescript
const schema = computed(() =>
  z.object({
    title: z
      .string({ required_error: t('form.post.title.required') })
      .min(TEXT_FIELD_LIMITS.TITLE.MIN, t('form.post.title.minLength'))
      .max(TEXT_FIELD_LIMITS.TITLE.MAX, t('form.post.title.maxLength'))
      .trim()
  })
)
```

### Validation Constants

Shared validation limits in `shared/constants/validation.ts`:

```typescript
export const TEXT_FIELD_LIMITS = {
  TITLE: { MIN: 3, MAX: 100 },
  CONTENT: { MIN: 10, MAX: 2000 }
}
```

## 🌍 Internationalization

Form validation messages support multiple languages:

```json
// i18n/locales/en.json
{
  "form": {
    "post": {
      "title": {
        "required": "Title is required",
        "minLength": "Title must be at least 3 characters",
        "maxLength": "Title cannot exceed 100 characters"
      }
    }
  }
}
```

## 🚀 Usage Example

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <FieldInput
      v-model="state.title"
      :label="t('form.post.title.label')"
      :placeholder="t('form.post.title.placeholder')"
      :error="titleError"
    />

    <FieldTextarea
      v-model="state.content"
      :label="t('form.post.content.label')"
      :placeholder="t('form.post.content.placeholder')"
      :error="contentError"
    />

    <UButton type="submit" :disabled="!isValid">
      {{ t('form.submit') }}
    </UButton>
  </form>
</template>

<script setup lang="ts">
const { t } = useI18n()

const { state, isValid, validate } = usePostForm()

const handleSubmit = async () => {
  const { isValid: valid, errors } = await validate()
  if (valid) {
    // Submit form
  }
}
</script>
```

## ✨ Benefits

- ✅ **Type-safe** form state management
- ✅ **Reactive validation** with real-time feedback
- ✅ **Internationalized** error messages
- ✅ **Reusable components** with consistent styling
- ✅ **Accessible** form structure with proper labels
