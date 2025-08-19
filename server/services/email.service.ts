import type { H3Event } from 'h3'

/**
 * Email Service - Handlebars templates with i18n support
 */

/**
 * Email route configurations
 */
const EMAIL_ROUTES = {
  verification: 'auth/verify-email',
  passwordReset: 'auth/reset-password'
} as const

/**
 * Get base URL from event or environment
 */
function getBaseUrl(event?: H3Event): string {
  if (event) {
    const headers = getHeaders(event)
    const host = headers.host || 'localhost:3000'
    const protocol = headers['x-forwarded-proto'] || 'http'
    return `${protocol}://${host}`
  }
  return process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

/**
 * Send email with Handlebars template
 */
async function sendEmailTemplate(
  templateType: EmailTemplateType,
  email: string,
  locale: string,
  data: EmailTemplateData,
  subject: string,
  event: H3Event
): Promise<void> {
  try {
    const html = await renderEmailTemplate(templateType, locale, data, event)
    const mail = useNodeMailer()

    // Validate email content for spam triggers
    validateEmailContent(subject, html)

    // Enhanced email options to avoid spam
    const fromDomain = process.env.NUXT_NODEMAILER_FROM?.split('@')[1]
    const plainText = htmlToPlainText(html)

    const mailOptions = {
      to: email,
      subject,
      html,
      text: plainText,
      headers: getAntiSpamHeaders(fromDomain),
      replyTo: process.env.NUXT_NODEMAILER_FROM || process.env.NUXT_NODEMAILER_AUTH_USER,
      envelope: {
        from: process.env.NUXT_NODEMAILER_FROM || process.env.NUXT_NODEMAILER_AUTH_USER,
        to: email
      }
    }

    await mail.sendMail(mailOptions)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Email send failed:', error.message)

    if (error.message === 'Email template rendering failed') {
      throw serverError(ERROR_CODES.SERVER.INTERNAL_ERROR, 'Failed to render email template')
    }

    if (
      error.code === 'EENVELOPE' ||
      error.responseCode === 553 ||
      error.response?.includes('Invalid email')
    ) {
      throw validationError(
        ERROR_CODES.VALIDATION.INVALID_FORMAT,
        'Invalid email address format',
        'email'
      )
    }

    throw serverError(
      ERROR_CODES.SERVER.EXTERNAL_SERVICE_ERROR,
      `Failed to send ${templateType} email`
    )
  }
}

/**
 * Send email with template type
 */
async function sendEmail(
  templateType: EmailTemplateType,
  event: H3Event,
  email: string,
  name: string,
  token: string,
  locale: string
): Promise<void> {
  const baseUrl = getBaseUrl(event)
  const t = await useTranslation(event)
  const actionUrl = `${baseUrl}/${locale}/${EMAIL_ROUTES[templateType]}?token=${token}`

  const data: EmailTemplateData = {
    name,
    actionUrl
  }

  await sendEmailTemplate(
    templateType,
    email,
    locale,
    data,
    t(`email.${templateType}.subject`),
    event
  )
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  event: H3Event,
  email: string,
  name: string,
  token: string,
  locale: string
): Promise<void> {
  await sendEmail('verification', event, email, name, token, locale)
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  event: H3Event,
  email: string,
  name: string,
  token: string,
  locale: string
): Promise<void> {
  await sendEmail('passwordReset', event, email, name, token, locale)
}
