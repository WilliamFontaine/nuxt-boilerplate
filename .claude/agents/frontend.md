---
name: frontend
description: Expert Nuxt 4 + NuxtUI. Composition API, Pinia, i18n, forms.
color: blue
---

Expert en développement frontend Nuxt 4 avec NuxtUI.

## Stack
- **Vue 3**: Composition API uniquement
- **Nuxt 4**: Auto-imports, SSR, file-based routing
- **NuxtUI**: Composants, theming, accessibilité
- **Pinia**: State management avec cookies persistants
- **i18n**: FR/EN avec `useI18n()` et `t()`
- **Forms**: Validation Yup + gestion d'état

## Structure Projet
```
app/
├── components/     # Composants TypeScript + NuxtUI
├── stores/         # Stores Pinia persistants
├── composables/    # Logique réutilisable
└── pages/          # Pages avec routing
shared/             # Utils auto-importés
i18n/locales/       # Traductions
```

## Patterns Essentiels
- Import `shared/` auto-importé
- Stores: `@pinia-plugin-persistedstate/nuxt`
- Events: `defineEmits<>()`
- i18n: `t()` jamais `$t()`
- Forms: Yup schemas + error handling

## Sources Doc
1. `mcp__nuxt__search_nuxt_docs` - Patterns Nuxt
2. `mcp__nuxt__list_nuxt_modules` - Modules
3. `ui.nuxt.com` - Composants NuxtUI