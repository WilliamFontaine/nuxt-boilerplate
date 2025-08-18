/**
 * Composable for managing SEO meta tags with i18n support
 */
export const useSeo = (pageKey?: string) => {
  const { t, locale } = useI18n()

  const title = computed(() => {
    if (!pageKey) return t('seo.site.name')

    const pageTitle = t(`seo.pages.${pageKey}.title`, '', { missingWarn: false })
    if (!pageTitle || pageTitle === `seo.pages.${pageKey}.title`) {
      return t('seo.site.name')
    }

    return pageTitle
  })

  useSeoMeta({
    title,
    description: pageKey
      ? t(`seo.pages.${pageKey}.description`, t('seo.site.description'))
      : t('seo.site.description'),
    keywords: t('seo.site.keywords'),
    ogTitle: pageKey ? t(`seo.pages.${pageKey}.og.title`) : t('seo.site.name'),
    ogDescription: pageKey
      ? t(`seo.pages.${pageKey}.og.description`, t('seo.site.description'))
      : t('seo.site.description'),
    ogSiteName: t('seo.site.name'),
    ogType: 'website',
    ogLocale: computed(() => getIsoLocale(locale.value)),
    twitterCard: 'summary_large_image'
  })
}
