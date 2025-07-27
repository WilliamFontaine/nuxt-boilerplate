# API Documentation

Auto-generated documentation via swagger-jsdoc.

## 🚀 Access

```bash
npm run dev
open http://localhost:3000/api/docs/ui
```

**⚠️ Development only** (403 in production)

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
