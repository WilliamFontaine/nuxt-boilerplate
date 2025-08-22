import Handlebars from 'handlebars'
import type { H3Event } from 'h3'

// Template cache for performance
const templateCache = new Map<string, HandlebarsTemplateDelegate>()

/**
 * Load template content from public assets
 */
async function loadTemplate(templateName: string): Promise<string> {
  // Use Nitro's assets storage to access public files
  const storage = useStorage('assets:templates')

  try {
    // Load template from public/templates/emails directory
    const content = await storage.getItem(`emails/${templateName}.hbs`)
    if (content) {
      return content as string
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to load template ${templateName}:`, error)
  }

  throw new Error(`Email template not found: ${templateName}`)
}

/**
 * Get compiled template from cache or compile and cache it
 */
async function getCompiledTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
  const cacheKey = templateName

  if (!templateCache.has(cacheKey)) {
    const content = await loadTemplate(templateName)

    if (!content) {
      throw new Error(`Email template not found: ${templateName}`)
    }

    templateCache.set(cacheKey, Handlebars.compile(content))
  }
  return templateCache.get(cacheKey)!
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
    const [baseTemplate, contentTemplate, footerTemplate] = await Promise.all([
      getCompiledTemplate('base'),
      getCompiledTemplate(templateType),
      getCompiledTemplate('footer')
    ])

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

/**
 * Clear template cache (useful for development)
 */
export function clearTemplateCache(): void {
  templateCache.clear()
}
