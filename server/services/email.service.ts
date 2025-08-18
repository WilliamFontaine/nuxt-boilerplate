import type { H3Event } from 'h3'

/**
 * Email Service - Simple HTML templates with server-side i18n
 */

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
 * Generate email HTML from common template
 */
function generateEmailHtml(params: {
  appName: string
  title: string
  userName: string
  actionUrl: string
  greeting: string
  message: string
  button: string
  footer: string
  expires: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 40px;">
    <h1 style="margin: 0 0 10px 0; font-size: 24px; color: #333;">${params.appName}</h1>
    <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #666;">${params.title}</h2>

    <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">
      ${params.greeting}
    </p>

    <p style="margin: 0 0 30px 0; font-size: 14px; color: #666; line-height: 1.5;">
      ${params.message}
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${params.actionUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
        ${params.button}
      </a>
    </div>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

    <p style="margin: 0 0 5px 0; font-size: 12px; color: #999;">${params.footer}</p>
    <p style="margin: 0; font-size: 12px; color: #999;">${params.expires}</p>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  event: H3Event,
  email: string,
  name: string,
  token: string,
  locale: string = 'fr'
): Promise<void> {
  const baseUrl = getBaseUrl(event)
  const verificationUrl = `${baseUrl}/${locale}/auth/verify-email?token=${token}`

  const t = await useTranslation(event)

  // Generate HTML email
  const html = generateEmailHtml({
    appName: t('email.common.appName'),
    title: t('email.verification.title'),
    userName: name,
    actionUrl: verificationUrl,
    greeting: t('email.common.greeting', { name }),
    message: t('email.verification.message'),
    button: t('email.verification.button'),
    footer: t('email.verification.footer'),
    expires: t('email.verification.expires')
  })

  const mail = useNodeMailer()

  try {
    await mail.sendMail({
      to: email,
      subject: t('email.verification.subject'),
      html
    })
  } catch (error: any) {
    // Handle invalid email format errors
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

    // Re-throw other errors
    throw serverError(
      ERROR_CODES.SERVER.EXTERNAL_SERVICE_ERROR,
      'Failed to send verification email'
    )
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  event: H3Event,
  email: string,
  name: string,
  token: string,
  locale: string = 'fr'
): Promise<void> {
  const baseUrl = getBaseUrl(event)
  const resetUrl = `${baseUrl}/${locale}/auth/reset-password?token=${token}`

  const t = await useTranslation(event)

  // Generate HTML email
  const html = generateEmailHtml({
    appName: t('email.common.appName'),
    title: t('email.passwordReset.title'),
    userName: name,
    actionUrl: resetUrl,
    greeting: t('email.common.greeting', { name }),
    message: t('email.passwordReset.message'),
    button: t('email.passwordReset.button'),
    footer: t('email.passwordReset.footer'),
    expires: t('email.passwordReset.expires')
  })

  const mail = useNodeMailer()

  try {
    await mail.sendMail({
      to: email,
      subject: t('email.passwordReset.subject'),
      html
    })
  } catch (error: any) {
    // Handle invalid email format errors
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

    // Re-throw other errors
    throw serverError(
      ERROR_CODES.SERVER.EXTERNAL_SERVICE_ERROR,
      'Failed to send password reset email'
    )
  }
}
