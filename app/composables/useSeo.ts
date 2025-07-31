interface SeoOptions {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  keywords?: string
}

export const useSeo = (pageKey?: string, options?: SeoOptions) => {
  const { t, locale } = useI18n()

  // Get SEO data from translations
  const getSeoData = (key: string) => {
    try {
      // Handle nested keys like 'error.404'
      const keyPath = key.includes('.') ? key : key
      return t(`seo.pages.${keyPath}`, {}, { missingWarn: false })
    } catch {
      return null
    }
  }

  // Build SEO configuration
  const buildSeoConfig = () => {
    let seoData: any = {}

    if (pageKey) {
      seoData = getSeoData(pageKey)
    }

    // Merge with options
    const title = options?.title || seoData?.title || t('seo.site.name')
    const description = options?.description || seoData?.description || t('seo.site.description')
    const ogTitle = options?.ogTitle || seoData?.og?.title || title
    const ogDescription = options?.ogDescription || seoData?.og?.description || description

    return {
      title,
      description,
      ogTitle,
      ogDescription,
      keywords: options?.keywords || t('seo.site.keywords')
    }
  }

  const seoConfig = buildSeoConfig()

  // Apply SEO using nuxt-seo
  useSeoMeta({
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    ogTitle: seoConfig.ogTitle,
    ogDescription: seoConfig.ogDescription,
    ogSiteName: t('seo.site.name'),
    ogType: 'website',
    ogLocale: getIsoLocale(locale.value),
    twitterCard: 'summary_large_image'
  })

  return seoConfig
}
