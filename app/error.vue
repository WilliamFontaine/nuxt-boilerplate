<template>
  <div class="h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
    <UContainer class="text-center space-y-6 px-4">
      <UIcon
        name="i-lucide:triangle-alert"
        class="w-16 h-16 text-red-500 dark:text-red-400 mx-auto"
      />
      <h1 class="text-4xl font-bold text-red-500 dark:text-red-400">
        {{ error?.statusCode === 404 ? t('error.404.title') : t('error.generic.title') }}
      </h1>
      <p class="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
        {{ error?.statusCode === 404 ? t('error.404.message') : t('error.generic.message') }}
      </p>
      <div class="flex gap-4 justify-center">
        <UButton color="neutral" variant="soft" icon="i-lucide:arrow-left" @click="goBack">
          {{ t('error.actions.back') }}
        </UButton>
        <UButton color="primary" icon="i-lucide:home" @click="goHome">
          {{ t('error.actions.home') }}
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
