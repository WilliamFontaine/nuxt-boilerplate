# 🌍 Internationalization (i18n)

Multi-language support with automatic locale detection, dynamic content, and SEO optimization for French and English locales.

## 🏗️ Architecture

```
i18n/
├── localeDetector.ts     # Automatic locale detection logic
└── locales/
    ├── en/
    │   ├── common.json   # Common UI translations
    │   ├── email.json    # Email template content
    │   └── seo.json      # SEO meta tags and descriptions
    └── fr/
        ├── common.json   # French UI translations
        ├── email.json    # French email content
        └── seo.json      # French SEO content
```

## 🔧 Configuration

### Nuxt i18n Setup

**Configuration**: See `nuxt.config.ts` i18n section for locale configuration, default language, and routing strategies.

**Features:**

- ✅ **French as default** locale
- ✅ **Automatic detection** from browser/cookies
- ✅ **URL-based routing** (/fr/, /en/)
- ✅ **SEO-friendly** URLs

### Locale Detection

**Implementation**: See `i18n/localeDetector.ts` for automatic locale detection from browser preferences and user settings.

## 📝 Translation Files

### Common Translations

**Implementation**: See `i18n/locales/*/common.json` for UI translations including forms, navigation, validation messages, and notifications.

**Structure:**

- **Forms** - Field labels, placeholders, buttons
- **Navigation** - Menu items, links
- **Validation** - Error messages, validation rules
- **Notifications** - Success/error toast messages
- **General** - Common UI text

### Email Translations

**Implementation**: See `i18n/locales/*/email.json` for email template content and subject lines.

**Content:**

- **Subject lines** - Localized email subjects
- **Template content** - Email body text
- **Action buttons** - Call-to-action text

### SEO Translations

**Implementation**: See `i18n/locales/*/seo.json` for meta tags, descriptions, and structured data.

**SEO Elements:**

- **Page titles** - Localized page titles
- **Meta descriptions** - Search-friendly descriptions
- **Keywords** - Relevant keywords per locale
- **Open Graph** - Social media sharing content

## 🎯 Usage Patterns

### In Components

**Implementation**: Use `useI18n()` composable for accessing translations in Vue components.

**Examples**: See components in `app/components/` and `app/pages/` for translation usage patterns.

### In Server Routes

**Implementation**: See `server/api/` routes for server-side translation access using `useTranslation()` utility.

## 🌐 SEO Integration

### Localized SEO

**Implementation**: See `app/composables/features/useSeo.ts` for SEO composable with i18n integration.

**Features:**

- ✅ **Dynamic meta tags** based on locale
- ✅ **Localized URLs** for better SEO
- ✅ **Open Graph** localization
- ✅ **Structured data** per language

### URL Structure

**Routing**: URLs include locale prefix (e.g., `/fr/auth/login`, `/en/auth/login`) for better SEO and user experience.

## 🔄 Locale Switching

### User Preferences

**Implementation**: See `app/components/layout/PreferencesControls.vue` for locale switching component.

**Persistence**: User language preference is stored in browser cookies and synchronized across sessions.

## 📧 Email Localization

### Template Localization

**Implementation**: Email templates automatically use user's preferred locale for content and subject lines.

**Templates**: See `server/templates/emails/` for templates that support dynamic content based on locale.

## 🛠️ Utilities

### Locale Utilities

**Implementation**: See `shared/utils/locale.ts` for locale conversion and validation utilities.

**Functions:**

- `getIsoLocale()` - Convert locale to ISO format
- `validateLocale()` - Validate locale strings

## ✨ Features

- ✅ **Automatic detection** from browser/cookies
- ✅ **French default** with English support
- ✅ **SEO-optimized** URLs and meta tags
- ✅ **Email localization** for templates
- ✅ **Persistent preferences** across sessions
- ✅ **Server-side support** for API routes
- ✅ **Dynamic content** based on locale

## 🔧 Adding New Languages

### Translation Files

1. **Create locale directory**: Add new folder in `i18n/locales/`
2. **Copy translation files**: Use existing `fr/` or `en/` as template
3. **Update configuration**: Add locale to `nuxt.config.ts`
4. **Test implementation**: Verify all features work with new locale

## 📚 Resources

- [Nuxt i18n Documentation](https://i18n.nuxtjs.org/)
- [Vue i18n Guide](https://vue-i18n.intlify.dev/)
- [Internationalization Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Internationalization_API)
