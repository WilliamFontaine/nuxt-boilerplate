# Auto-imports Configuration

This document describes the optimized auto-imports configuration for better performance and tree-shaking.

## Client-side Configuration (App)

### Auto-imported directories

```typescript
// nuxt.config.ts - imports.dirs
;[
  'composables/**', // All Vue composables
  '../shared/**' // All shared resources
]
```

### Available client-side auto-imports

#### Composables

- `useLoginForm()` - Login form management with validation
- `useRegisterForm()` - Registration form management
- `usePostForm()` - Post creation/editing form management
- `useForgotPasswordForm()` - Forgot password form management
- `useResetPasswordForm()` - Password reset form management
- `useNotifications()` - Toast notification system
- `useSeo()` - SEO metadata management
- `usePreferences()` - User preferences store wrapper
- `useApiError()` - API error handling utilities

#### Constants

- `TEXT_FIELD_LIMITS` - Field length validation limits
- `VALIDATION_PATTERNS` - Common RegEx validation patterns
- `ERROR_CODES` - Standardized error codes for API responses
- `PAGINATION_LIMITS` - Default pagination settings

#### Models and Types

- `LoginData`, `RegisterData`, `CreateUserData`, `PublicUser`
- `Post`, `PostWithAuthor`, `CreatePostData`, `UpdatePostData`
- `ApiResponse<T>`, `ApiErrorData`, `ServerError`
- `PostViewMode`, `PostDisplayMode`, `UserPreferences`
- `TokenType`, `Token`

#### Zod Schemas

- `loginSchema`, `registerSchema` - Authentication schemas
- `createPostSchema`, `updatePostSchema` - Post validation schemas
- `forgotPasswordSchema`, `resetPasswordSchema` - Password reset schemas
- `idSchema` - Common ID validation

#### Utilities

- `formatDate()`, `formatTime()` - Date/time formatting
- `getIsoLocale()` - Locale management utilities

#### Explicit imports

- `z` from `zod` - Zod schema constructor (globally available)

## Server-side Configuration (Nitro)

### Auto-imported directories

```typescript
// nuxt.config.ts - nitro.imports.dirs
;[
  'shared/**', // All shared resources
  'server/constants/**', // Server constants
  'server/services/**', // Business logic services
  'server/utils/**', // Server utilities
  'server/types/**' // Server-specific types
]
```

### Available server-side auto-imports

#### Services

**Authentication & Users:**

- `createUser()`, `authenticateUser()`, `getUserById()`
- `hashPassword()`, `verifyPassword()`

**Posts:**

- `createPost()`, `getAllPosts()`, `getPostById()`, `updatePost()`, `deletePost()`

**Email System:**

- `sendVerificationEmail()`, `sendPasswordResetEmail()`
- `renderEmailTemplate()`, `getEmailConfig()`
- `getAntiSpamHeaders()`, `validateEmailContent()`

**Tokens:**

- `createToken()`, `verifyToken()`, `deleteToken()`

**Rate Limiting:**

- `checkLoginAttempt()`, `recordLoginAttempt()`, `checkTokenRateLimit()`
- `getClientIP()`

#### Constants

- `HTTP_STATUS` - HTTP status code constants
- `PRISMA_ERRORS` - Prisma error code mappings

#### Server Utilities

**Response Helpers:**

- `createApiResponse()` - Create standard API responses
- `createApiError()` - Create typed API errors
- `createCreatedResponse()` - Create 201 Created responses
- `createNoContentResponse()` - Create 204 No Content responses
- `createDeletedResponse()` - Create deletion confirmation responses
- `badRequestError()` - 400 Bad Request errors
- `unauthorizedError()` - 401 Unauthorized errors
- `forbiddenError()` - 403 Forbidden errors
- `notFoundError()` - 404 Not Found errors
- `conflictError()` - 409 Conflict errors
- `validationError()` - Validation error formatting
- `rateLimitError()` - Rate limit error formatting
- `serverError()` - 500 Internal Server errors

**Validation Helpers:**

- `validateBody()` - Validate request body with Zod schema
- `validateParams()` - Validate route parameters with Zod schema
- `validateQuery()` - Validate query parameters with Zod schema

**Email Helpers:**

- `getEmailTransporter()` - Get configured Nodemailer transporter

**Logging:**

- `logger` - Application logger instance

#### Server Types

- `EmailTemplateType`, `EmailLocale`, `EmailTemplateData`
- `EmailTemplateConfig`, `EmailTemplate`

#### Explicit server imports

- `z` from `zod` - Zod schema constructor (server-side)

## Configuration Benefits

### 🚀 Improved Performance

- **Optimized tree-shaking**: Only used imports are bundled
- **Smaller client bundle**: Server types excluded from client
- **Selective imports**: Targeted directories instead of wildcards

### 🏗️ Cleaner Architecture

- **Clear separation**: Server types isolated in `/server/types/`
- **Logical imports**: Each environment imports what it needs
- **Easy maintenance**: Well-documented configuration

### 🔧 Better Development Experience

- **Enhanced IntelliSense**: Optimal auto-completion
- **Error detection**: Better missing import detection
- **Clear documentation**: Available imports explicitly listed

## Migration from Previous Configuration

### Key Changes

1. **Simplified client imports**: Now using `../shared/**` for all shared resources
2. **Comprehensive server imports**: All server resources auto-imported
3. **Global Zod**: `z` available everywhere without explicit imports
4. **Better documentation**: All available imports clearly listed

### Impact on Existing Code

- ✅ **No code changes required**: Auto-imports continue working
- ✅ **Improved performance**: Lighter client bundle
- ✅ **Better maintainability**: Clearer architecture

## Validation

To verify the configuration is working:

```bash
# Rebuild to regenerate auto-imports
pnpm run build

# Check generated auto-imports
cat .nuxt/imports.d.ts | grep -E "(useLoginForm|ERROR_CODES|createUser)"

# Verify no manual imports needed in components
grep -r "import.*from.*shared" app/components/ || echo "✅ No manual shared imports found"
```

## Adding New Auto-imports

### Client-side

Add new composables, utilities, or types to the appropriate `/shared/` or `/app/composables/` directory. They will be automatically imported.

### Server-side

Add new services, utilities, or types to the appropriate `/server/` subdirectory. They will be automatically available in API routes and middleware.

### Example: Adding a new composable

```typescript
// app/composables/useCustomHook.ts
export const useCustomHook = () => {
  // Implementation
  return { /* exported functions */ }
}

// Automatically available in components without import
// app/components/SomeComponent.vue
<script setup>
const { someFunction } = useCustomHook() // ✅ Auto-imported
</script>
```
