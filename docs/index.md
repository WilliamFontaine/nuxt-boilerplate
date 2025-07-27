# 📖 Implementation Guide

Detailed implementation patterns and advanced usage for experienced developers.

> For project setup and basic commands, see [README.md](../README.md) and [CLAUDE.md](../CLAUDE.md)

## 📚 Advanced Topics

### Implementation Patterns

- **[📝 Form Patterns](./form-patterns.md)** - Advanced form patterns, custom validation, field composition
- **[🔔 Notification System](./notification-system.md)** - Toast system internals and customization
- **[🗃️ Database Patterns](./database-patterns.md)** - Prisma patterns, query optimization, error handling
- **[🧩 Component Architecture](./component-architecture.md)** - Component composition, patterns, and architecture

### API Reference

- **[📡 API](./api/)** - OpenAPI specification and implementation details

## 🎨 Design Patterns

### Form Architecture

**Composable-driven approach** with reactive validation:

```typescript
// Form state management
const { state, validate, resetState } = usePostForm()

// Field composition
<FieldInput v-model="state.title" :schema="schema.title" />
```

### Component Composition

**Slot-based architecture** for maximum flexibility:

```vue
<UModal v-model:open="showModal">
  <template #body>
    <slot name="content" :loading="isLoading" />
  </template>
</UModal>
```

### Database Patterns

**Singleton + Error Handling**:

```typescript
import prisma from '@@/lib/prisma'

try {
  const result = await prisma.post.findMany()
  return { statusCode: 200, data: result }
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    // Handle specific Prisma errors
  }
}
```

## 🔧 Advanced Techniques

### Custom Validation Schemas

```typescript
const dynamicSchema = computed(() => {
  return yup.object().shape({
    title: yup
      .string()
      .required(t('validation.required'))
      .test('unique', t('validation.unique'), async (value) => {
        // Custom async validation
      })
  })
})
```

### Complex Component Patterns

```vue
<!-- Higher-order component pattern -->
<script setup lang="ts" generic="T extends Record<string, any>">
interface Props<T> {
  data: T
  transform: (item: T) => unknown
}
</script>
```

### API Error Handling

```typescript
// Centralized error handling
export const handleApiError = (error: unknown) => {
  if (error instanceof H3Error) {
    return { statusCode: error.statusCode, message: error.message }
  }
  return { statusCode: 500, message: 'Internal server error' }
}
```
