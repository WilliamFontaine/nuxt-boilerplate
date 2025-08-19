import type { H3Event } from 'h3'
import { sendEmailTemplate } from './email/mailer'
import { getBaseUrl, EMAIL_ROUTES } from './email/config'

/**
 * Email Service - Handlebars templates with i18n support
 */

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
