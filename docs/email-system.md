# 📧 Email System

Comprehensive email system with Handlebars templates, internationalization support, and automated delivery for authentication workflows.

## 🏗️ Architecture

```
server/services/email/
├── config.ts              # Email configuration and routes
├── mailer.ts              # Nodemailer setup and sending logic
├── template-renderer.ts   # Handlebars template rendering
└── anti-spam.ts          # Rate limiting and spam protection

server/templates/emails/
├── base.hbs              # Base email template layout
├── footer.hbs            # Common email footer
├── verification.hbs      # Email verification template
└── passwordReset.hbs     # Password reset template
```

## 🔧 Configuration

### Environment Variables

**Configuration**: See `.env.example` for complete email configuration including SMTP settings, authentication, and sender information.

### Email Routes

**Implementation**: See `server/services/email/config.ts` for email route configuration and base URL handling.

## 📮 Email Templates

### Template System

**Implementation**: See `server/services/email/template-renderer.ts` for Handlebars template rendering with i18n support.

**Features:**

- ✅ **Handlebars templates** with partials support
- ✅ **Internationalization** with dynamic locale loading
- ✅ **Responsive design** with email-safe HTML/CSS
- ✅ **Consistent branding** across all templates

### Available Templates

#### Email Verification

**Template**: See `server/templates/emails/verification.hbs` for email verification template.

**Usage**: Automatically sent during user registration process.

#### Password Reset

**Template**: See `server/templates/emails/passwordReset.hbs` for password reset template.

**Usage**: Sent when users request password reset via forgot password flow.

## 🚀 Email Service

### Core Service

**Implementation**: See `server/services/email.service.ts` for email sending functions with template integration.

**Methods:**

- `sendVerificationEmail()` - Send verification email to new users
- `sendPasswordResetEmail()` - Send password reset link

### Mailer Integration

**Implementation**: See `server/services/email/mailer.ts` for Nodemailer configuration and sending logic.

## 🛡️ Security Features

### Anti-Spam Protection

**Implementation**: See `server/services/email/anti-spam.ts` for rate limiting and abuse prevention.

**Features:**

- ✅ **Rate limiting** per email address and IP
- ✅ **Token expiration** for security
- ✅ **Email validation** before sending

### Email Validation

**Implementation**: Email addresses are validated using Zod schemas before sending.

## 🌍 Internationalization

### Localized Content

**Implementation**: Templates support multiple languages with automatic locale detection from user preferences.

**Locales**: See `i18n/locales/*/email.json` for email content translations.

## 🧪 Usage Examples

### Authentication Integration

**Implementation**: See `server/api/auth/` routes for email service integration in registration and password reset flows.

### Error Handling

**Implementation**: Email service includes comprehensive error handling for delivery failures and configuration issues.

## ✨ Features

- ✅ **Template-based emails** with Handlebars
- ✅ **Multi-language support** with i18n
- ✅ **Responsive design** for all devices
- ✅ **Anti-spam protection** with rate limiting
- ✅ **Secure token handling** for verification
- ✅ **SMTP configuration** flexibility
- ✅ **Error handling** and logging

## 📚 Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Handlebars Template Guide](https://handlebarsjs.com/guide/)
- [Email Template Best Practices](https://www.campaignmonitor.com/resources/guides/email-template-coding/)
