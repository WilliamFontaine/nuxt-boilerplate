# 🔔 Notification System

Unified notification system using Nuxt UI Toast components with consistent styling and behavior.

## 🏗️ Architecture

The notification system is centralized in a single composable:

```
app/composables/useNotifications.ts  # Main notification logic
```

## 🔧 Core Composable

### `useNotifications`

**Implementation**: See `app/composables/useNotifications.ts` for toast notification methods with predefined styling.

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

**Implementation**: See components in `app/components/features/` and authentication pages for notification usage in form submissions and API operations.

## 🌟 Features

- ✅ **Consistent styling** across all notification types
- ✅ **Accessible icons** from Lucide icon set
- ✅ **Type-safe** notification options
- ✅ **Centralized logic** for easy maintenance
- ✅ **Built on Nuxt UI** toast system
