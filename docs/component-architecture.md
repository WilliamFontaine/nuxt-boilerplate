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

**Implementation**: See components in `app/components/features/post/` for complete prop and event type definitions.

### 2. v-model Pattern

**Implementation**: See `app/components/ui/form/` for v-model patterns and `app/components/features/post/CreateModal.vue` for named models.

### 3. Composable Integration

**Implementation**: See components for composable integration patterns with useI18n, useNotifications, and form composables.

## 🎨 Component Categories

### Display Components

**Implementation**: See `app/components/features/post/Card.vue` for complete post display component with Nuxt UI integration.

**Features:**

- ✅ **Nuxt UI Pro v4 integration** with UCard, UButton, UDropdownMenu
- ✅ **Overlay system** with useOverlay() for modal management
- ✅ **Consistent styling** with primary/secondary color scheme
- ✅ **Micro-interactions** with hover effects and transitions

### Modal Components

**Implementation**: See `app/components/features/post/CreateModal.vue` for complete modal component with form integration.

**Features:**

- ✅ **UAuthForm integration** for consistent form patterns
- ✅ **Composable-driven** with usePostForm, useLoginForm, useRegisterForm
- ✅ **Overlay management** with useOverlay() for better UX
- ✅ **Real-time analytics** with character count, word count, reading time

### Form Field Components

**Implementation**: See `app/components/ui/form/` directory for consistent field component patterns with UFormField integration.

## 🎭 Styling Patterns

### Nuxt UI Pro v4 Integration

**Implementation**: See components for consistent color and variant usage patterns with Nuxt UI components.

### Responsive Design

**Implementation**: Components follow mobile-first responsive design with Tailwind CSS utilities and dark mode support.

### Dark Mode Support

**Implementation**: All components include dark mode variants using Tailwind's dark: prefix classes.

## 🔧 State Management

### Local State

**Implementation**: Components use Vue's reactive refs and reactive objects for local state management.

### Computed Properties

**Implementation**: Components leverage Vue's computed properties for reactive derived state and dynamic content.

### Watchers

**Implementation**: Components use Vue watchers for reactive state updates based on prop changes and external data.

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
