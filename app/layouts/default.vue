<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <header
      class="py-4 px-4 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800"
    >
      <NuxtLink
        :to="localePath('index')"
        class="text-xl font-bold text-secondary-500 dark:text-secondary-400"
      >
        {{ t('app.name') }}
      </NuxtLink>
      <div class="flex items-center gap-4">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </header>

    <div class="mx-auto">
      <main>
        <slot />
      </main>

      <footer class="py-6 border-t border-neutral-200 dark:border-neutral-800">
        <p class="text-neutral-600 dark:text-neutral-400 text-center">
          {{ t('app.footer') }}
        </p>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
const localePath = useLocalePath()
const { t } = useI18n()

useHead({
  title: t('app.name'),
  meta: [
    { name: 'description', content: t('app.description') },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>
