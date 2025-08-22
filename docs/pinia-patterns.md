# Pinia State Management Patterns

This document outlines the Pinia state management patterns used in this Nuxt 4 project.

## Store Architecture

### Store Definition Pattern

**Implementation**: See `app/stores/usePreferences.ts` for complete store definition with state, actions, and persistence configuration.

### Composable Wrapper Pattern

**Implementation**: See `app/composables/usePreferences.ts` for composable wrapper pattern with reactive refs.

## Persistent State with Cookies

### Configuration

**Configuration**: See `nuxt.config.ts` for Pinia modules configuration with persistedstate plugin.

### Cookie Storage Options

**Implementation**: See `app/stores/usePreferences.ts` for cookie storage configuration with expiration and security options.

## Usage in Components

### Template Usage

**Implementation**: See `app/components/layout/PreferencesControls.vue` for complete component usage with Pinia store integration.

## Type Safety

### Store Types

**Implementation**: See `shared/types/preferences.ts` for PostViewMode and PostDisplayMode type definitions.

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

**Implementation**: Store testing patterns can be implemented using createPinia setup and component mocking.
