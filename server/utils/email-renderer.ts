import Handlebars from 'handlebars'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import type { H3Event } from 'h3'

// Template cache for performance
const templateCache = new Map<string, HandlebarsTemplateDelegate>()

/**
 * Get compiled template from cache or compile and cache it
 */
function getCompiledTemplate(templatePath: string): HandlebarsTemplateDelegate {
  if (!templateCache.has(templatePath)) {
    if (!existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templatePath}`)
    }
    const content = readFileSync(templatePath, 'utf-8')
    templateCache.set(templatePath, Handlebars.compile(content))
  }
  return templateCache.get(templatePath)!
}

/**
 * Render email template with Handlebars
 */
export async function renderEmailTemplate(
  templateType: EmailTemplateType,
  locale: string,
  data: EmailTemplateData,
  event: H3Event
): Promise<string> {
  try {
    const t = await useTranslation(event)
    const validLocale = getValidEmailLocale(locale)

    // Get compiled templates from cache
    const basePath = resolve(process.cwd(), 'server/templates/emails/base.hbs')
    const contentPath = resolve(process.cwd(), `server/templates/emails/${templateType}.hbs`)
    const footerPath = resolve(process.cwd(), 'server/templates/emails/footer.hbs')

    const baseTemplate = getCompiledTemplate(basePath)
    const contentTemplate = getCompiledTemplate(contentPath)
    const footerTemplate = getCompiledTemplate(footerPath)

    // Prepare content data
    const contentData = {
      greeting: t(`email.${templateType}.greeting`, { name: data.name }),
      message1: t(`email.${templateType}.message1`),
      message2: t(`email.${templateType}.message2`),
      buttonText: t(`email.${templateType}.buttonText`),
      actionUrl: data.actionUrl,
      alternativeText: t(`email.${templateType}.alternativeText`),
      securityTitle: t('email.common.securityTitle'),
      securityNote: t(`email.${templateType}.securityNote`)
    }

    // Prepare footer data
    const footerData = {
      footer1: t(`email.${templateType}.footer1`),
      footer2: t(`email.${templateType}.footer2`),
      legalText: t('email.common.legalText'),
      unsubscribeText: t('email.common.unsubscribeText')
    }

    // Render content and footer
    const content = contentTemplate(contentData)
    const footer = footerTemplate(footerData)

    // Prepare final data for base template
    const finalData = {
      locale: validLocale,
      appName: 'Nuxt Boilerplate',
      emailTitle: t(`email.${templateType}.title`),
      subtitle: t(`email.${templateType}.subtitle`),
      content,
      footer
    }

    // Render final email
    return baseTemplate(finalData)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      'Email template rendering failed:',
      error instanceof Error ? error.message : String(error)
    )
    throw new Error('Email template rendering failed')
  }
}
