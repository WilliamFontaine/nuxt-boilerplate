# API Documentation

Auto-generated documentation via swagger-jsdoc.

## 🚀 Access

```bash
npm run dev
open http://localhost:3000/api/docs/ui
```

**⚠️ Development only** (403 in production)

## 🔐 Authentication Endpoints

The API includes authentication endpoints for user registration and login:

### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Response:** `201 Created` with user data (excluding password)

### POST /api/auth/login

Authenticate user and create session.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK` with user data and session cookie

### POST /api/auth/logout

End user session.

**Response:** `200 OK` with success message

## 🛡️ Protected Routes

All API routes except authentication and public endpoints require authentication:

- **Protected:** POST/PUT/DELETE operations on posts
- **Public:** GET operations on posts, authentication endpoints, documentation

Authentication is handled automatically by the global auth middleware.

## 📝 Adding an endpoint

```typescript
/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create user
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: Success
 */
export default defineEventHandler(async (event) => {
  // Code here
})
```

## ✅ Benefits

- ✅ **Auto-generated** from code
- ✅ **Always synchronized**
- ✅ **Zero maintenance**
- ✅ **Secure** (dev only)
