import { randomBytes } from 'crypto'
/**
 * Email deliverability utilities to avoid spam filters
 */

/**
 * Generate a unique Message-ID for better email tracking
 */
export function generateMessageId(domain?: string): string {
  const timestamp = Date.now()
  const randomId = randomBytes(9).toString('hex')
  const hostDomain = domain || 'localhost'
  return `<${timestamp}-${randomId}@${hostDomain}>`
}

/**
 * Convert HTML to plain text for better deliverability
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '') // Remove style tags
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, '\'') // Replace &#39; with '
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim()
}

/**
 * Generate essential anti-spam headers
 */
export function getAntiSpamHeaders(fromDomain?: string): Record<string, string> {
  return {
    'X-Mailer': 'Nuxt Boilerplate',
    'Message-ID': generateMessageId(fromDomain),
    'X-Priority': '3'
  }
}

/**
 * Basic email content validation (simplified for boilerplate)
 */
export function validateEmailContent(subject: string, content: string): void {
  // For boilerplate: just ensure content exists
  if (!subject.trim() || !content.trim()) {
    throw new Error('Email subject and content are required')
  }
}
