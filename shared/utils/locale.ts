/**
 * Convert Nuxt i18n locale codes to ISO locale format
 * @param locale - The locale code (e.g., 'en', 'fr')
 * @returns ISO locale format (e.g., 'en_US', 'fr_FR')
 */
export const getIsoLocale = (locale: string): string => {
  const localeMap: Record<string, string> = {
    en: 'en_US',
    fr: 'fr_FR'
  }

  return localeMap[locale] || 'en_US'
}
