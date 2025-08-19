import type { H3Event } from 'h3'

/**
 * Email configuration and utilities
 */

/**
 * Email route configurations
 */
export const EMAIL_ROUTES: Record<EmailTemplateType, string> = {
  verification: 'auth/verify-email',
  passwordReset: 'auth/reset-password'
}

/**
 * Get base URL from event or environment
 */
export function getBaseUrl(event?: H3Event): string {
  if (event) {
    const headers = getHeaders(event)
    const host = headers.host || 'localhost:3000'
    const protocol = headers['x-forwarded-proto'] || 'http'
    return `${protocol}://${host}`
  }
  return process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}
