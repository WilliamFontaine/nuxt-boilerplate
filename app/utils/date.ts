export const formatDate = (dateString: string | Date | null, locale?: string): string => {
  if (!dateString) return ''

  const { locale: currentLocale } = useI18n()
  const finalLocale = locale || currentLocale?.value || 'fr-FR'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''

    return date.toLocaleDateString(finalLocale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return ''
  }
}

export const formatTime = (dateString: string, locale?: string): string => {
  if (!dateString) return ''

  const { locale: currentLocale } = useI18n()
  const finalLocale = locale || currentLocale?.value || 'fr-FR'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    return date.toLocaleTimeString(finalLocale, {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}
