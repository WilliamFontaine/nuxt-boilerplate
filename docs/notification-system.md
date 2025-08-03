# 🔔 Notification System

Unified notification system using Nuxt UI Toast components with consistent styling and behavior.

## 🏗️ Architecture

The notification system is centralized in a single composable:

```
app/composables/useNotifications.ts  # Main notification logic
```

## 🔧 Core Composable

### `useNotifications`

Provides consistent toast notifications with predefined styling:

```typescript
const { success, error, info, warning } = useNotifications()

// Success notification
success({
  title: 'Operation Successful',
  message: 'Your post has been created successfully'
})

// Error notification
error({
  title: 'Error Occurred',
  message: 'Failed to save the post. Please try again.'
})

// Info notification
info({
  title: 'Information',
  message: 'This feature is coming soon'
})

// Warning notification
warning({
  title: 'Warning',
  message: 'You have unsaved changes'
})
```

## 🎨 Notification Types

### Success

- **Icon**: `i-lucide-check-circle`
- **Color**: `success` (green)
- **Use case**: Successful operations, confirmations

### Error

- **Icon**: `i-lucide-x-circle`
- **Color**: `error` (red)
- **Use case**: Failed operations, validation errors

### Info

- **Icon**: `i-lucide-info`
- **Color**: `info` (blue)
- **Use case**: General information, tips

### Warning

- **Icon**: `i-lucide-triangle-alert`
- **Color**: `warning` (orange/yellow)
- **Use case**: Warnings, important notices

## 🚀 Usage Examples

### Form Submission

```vue
<script setup lang="ts">
const { success, error } = useNotifications()

const handleSubmit = async () => {
  try {
    await $fetch('/api/posts', {
      method: 'POST',
      body: formData
    })

    success({
      title: 'Post Created',
      message: 'Your post has been published successfully'
    })
  } catch (err) {
    error({
      title: 'Creation Failed',
      message: 'Unable to create post. Please check your input and try again.'
    })
  }
}
</script>
```

### API Operations

```typescript
// Success feedback
const deletePost = async (id: string) => {
  try {
    await $fetch(`/api/posts/${id}`, { method: 'DELETE' })
    success({
      title: 'Post Deleted',
      message: 'The post has been removed successfully'
    })
  } catch (err) {
    error({
      title: 'Deletion Failed',
      message: 'Could not delete the post. Please try again.'
    })
  }
}
```

## 🌟 Features

- ✅ **Consistent styling** across all notification types
- ✅ **Accessible icons** from Lucide icon set
- ✅ **Type-safe** notification options
- ✅ **Centralized logic** for easy maintenance
- ✅ **Built on Nuxt UI** toast system

## 🎯 Advanced Patterns

### Interactive Notifications

```typescript
// Notification with action button
success({
  title: 'Post Created',
  message: 'Your post has been published successfully',
  action: {
    label: 'View Post',
    handler: () => navigateTo(localePath(`/posts/${newPost.id}`))
  }
})
```

### Context-Aware Notifications

```typescript
export const useContextualNotifications = (context: string) => {
  const { success, error } = useNotifications()

  return {
    success: (options: Omit<ToastOptions, 'title'>) =>
      success({
        ...options,
        title: t(`notifications.${context}.success.title`)
      })
  }
}

// Usage: automatically uses context-specific titles
const notifications = useContextualNotifications('posts')
notifications.success({ message: 'Post created successfully' })
```

### Notification Throttling

```typescript
const useThrottledNotifications = () => {
  const recentNotifications = new Map<string, number>()
  const THROTTLE_DURATION = 3000

  const shouldThrottle = (message: string) => {
    const now = Date.now()
    const lastShown = recentNotifications.get(message)

    if (lastShown && now - lastShown < THROTTLE_DURATION) {
      return true
    }

    recentNotifications.set(message, now)
    return false
  }

  return { shouldThrottle }
}
```
