import type { H3Event } from 'h3'
import { renderEmailTemplate } from './template-renderer'
import { validateEmailContent, htmlToPlainText, getAntiSpamHeaders } from './anti-spam'

/**
 * Email sending functionality
 */

/**
 * Send email with Handlebars template
 */
export async function sendEmailTemplate(
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

    const fromEmail = process.env.NUXT_NODEMAILER_FROM || process.env.NUXT_NODEMAILER_AUTH_USER
    const fromName = 'Nuxt Boilerplate'

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: `[${fromName}] ${subject}`,
      html,
      text: plainText,
      headers: getAntiSpamHeaders(fromDomain),
      replyTo: fromEmail,
      envelope: {
        from: fromEmail,
        to: email
      },
      // Additional anti-spam measures
      messageId: getAntiSpamHeaders(fromDomain)['Message-ID'],
      date: new Date().toUTCString(),
      encoding: 'utf8'
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
