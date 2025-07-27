# API Documentation

Documentation auto-générée via swagger-jsdoc.

## 🚀 Accès

```bash
npm run dev
open http://localhost:3000/api/docs/ui
```

**⚠️ Développement uniquement** (403 en production)

## 📝 Ajouter un endpoint

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
  // Code ici
})
```

## ✅ Avantages

- ✅ **Auto-générée** depuis le code
- ✅ **Toujours synchronisée**
- ✅ **Zéro maintenance**
- ✅ **Sécurisée** (dev uniquement)
