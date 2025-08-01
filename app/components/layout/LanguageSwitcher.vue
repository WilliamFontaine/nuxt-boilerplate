<template>
  <ClientOnly>
    <UDropdownMenu :items="languageItems">
      <UButton color="neutral" variant="ghost" :icon="currentLocaleIcon" />
    </UDropdownMenu>
    <template #fallback>
      <UButton color="neutral" variant="ghost" icon="i-lucide:languages" disabled />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const currentLocaleIcon = computed(() => {
  const currentLocale = locales.value.find((l) => l.code === locale.value)
  return (currentLocale as any)?.flag || 'i-lucide:languages'
})

const languageItems = computed(() =>
  locales.value.map((lang) => ({
    label: lang.name || lang.code,
    icon: (lang as any).flag || 'i-lucide:languages',
    onSelect: () => setLocale(lang.code)
  }))
)
</script>
