export const formatDate = (dateString: string, locale?: string): string => {
  if (!dateString) return ''

  const { locale: currentLocale } = useI18n()
  const finalLocale = locale || currentLocale?.value || 'fr-FR'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    return date.toLocaleDateString(finalLocale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateString
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
