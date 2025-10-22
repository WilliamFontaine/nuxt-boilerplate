<template>
  <div class="h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
    <UContainer class="text-center space-y-6 px-4">
      <UIcon
        name="i-lucide:triangle-alert"
        class="w-16 h-16 text-error-500 dark:text-error-400 mx-auto"
      />
      <h1 class="text-4xl font-bold text-error-500 dark:text-error-400">
        {{ error?.statusCode === 404 ? t('errors.404.title') : t('errors.generic.title') }}
      </h1>
      <p class="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
        {{ error?.statusCode === 404 ? t('errors.404.message') : t('errors.generic.message') }}
      </p>
      <div class="flex gap-4 justify-center">
        <UButton color="neutral" variant="soft" icon="i-lucide:arrow-left" @click="goBack">
          {{ t('errors.actions.back') }}
        </UButton>
        <UButton color="primary" icon="i-lucide:home" @click="goHome">
          {{ t('errors.actions.home') }}
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const error = useError()

const errorKey = error?.value?.statusCode === 404 ? '404' : '500'
useSeo(`error.${errorKey}`)

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>
