/**
 * Email Model
 *
 * This file contains Email-related types, interfaces and constants
 */

// =============================================================================
// EMAIL TYPES
// =============================================================================

/**
 * Available email template types
 */
export type EmailTemplateType = 'verification' | 'passwordReset'

/**
 * Available locales for email templates
 */
export type EmailLocale = 'fr' | 'en'

/**
 * Email template data interface
 */
export interface EmailTemplateData {
  name: string
  actionUrl: string
}

// =============================================================================
// TEMPLATE CONFIGURATIONS
// =============================================================================

/**
 * Email template configuration
 */
export interface EmailTemplateConfig {
  type: EmailTemplateType
  locale: EmailLocale
}

/**
 * Email template metadata
 */
export interface EmailTemplate extends EmailTemplateConfig {
  name: string
  subject: string
  data: EmailTemplateData
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Supported email locales
 */
export const EMAIL_LOCALES: EmailLocale[] = ['fr', 'en']

/**
 * Supported email template types
 */
export const EMAIL_TEMPLATE_TYPES: EmailTemplateType[] = ['verification', 'passwordReset']

/**
 * Default email locale
 */
export const DEFAULT_EMAIL_LOCALE: EmailLocale = 'fr'

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if locale is supported
 */
export function isValidEmailLocale(locale: string): locale is EmailLocale {
  return EMAIL_LOCALES.includes(locale as EmailLocale)
}

/**
 * Get valid email locale with fallback to default
 */
export function getValidEmailLocale(locale: string): EmailLocale {
  return isValidEmailLocale(locale) ? locale : DEFAULT_EMAIL_LOCALE
}

/**
 * Check if template type is valid
 */
export function isValidEmailTemplateType(type: string): type is EmailTemplateType {
  return EMAIL_TEMPLATE_TYPES.includes(type as EmailTemplateType)
}
