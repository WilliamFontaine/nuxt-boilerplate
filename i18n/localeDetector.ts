export default defineI18nLocaleDetector((event, config) => {
  // try to get locale from query
  const query = tryQueryLocale(event, { lang: '' })
  if (query) {
    return query.toString()
  }

  // try to get locale from cookie
  const cookie = tryCookieLocale(event, { lang: '', name: 'i18n_redirected' })
  if (cookie) {
    return cookie.toString()
  }

  // try to get locale from header
  const header = tryHeaderLocale(event, { lang: '' })
  if (header) {
    return header.toString()
  }

  // fallback to default
  return config.defaultLocale
})
