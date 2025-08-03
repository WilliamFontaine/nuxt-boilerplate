<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
  >
    <UContainer class="max-w-md">
      <UCard class="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <template #header>
          <div class="text-center space-y-2">
            <UIcon
              name="i-lucide:lock-keyhole"
              class="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400"
            />
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ t('auth.login.title') }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('auth.login.subtitle') }}
            </p>
          </div>
        </template>

        <UForm ref="formRef" :schema="schema" :state="state" @submit="handleSubmit">
          <div class="space-y-6">
            <UiFormEmail
              v-model="state.email"
              :label="t('auth.login.email.label')"
              :placeholder="t('auth.login.email.placeholder')"
              name="email"
              required
            />

            <UiFormPassword
              v-model="state.password"
              :label="t('auth.login.password.label')"
              :placeholder="t('auth.login.password.placeholder')"
              name="password"
              required
            />
          </div>
        </UForm>

        <template #footer>
          <div class="flex flex-col w-full">
            <div class="flex gap-3 self-center mt-4">
              <UButton
                type="button"
                color="neutral"
                variant="outline"
                :label="t('auth.login.cancel')"
                icon="i-lucide-x"
                :disabled="isLoading"
                @click="navigateTo(localePath('/'))"
              />
              <UButton
                type="submit"
                color="primary"
                :label="t('auth.login.submit')"
                :loading="isLoading"
                :disabled="isLoading || !isValid"
                icon="i-lucide-log-in"
                @click="formRef?.submit()"
              />
            </div>

            <div class="text-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="space-y-2">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ t('auth.login.noAccount') }}
                </p>
                <NuxtLink
                  :to="localePath('/auth/register')"
                  class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                >
                  {{ t('auth.login.register') }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
const { t } = useI18n()
const { fetch: fetchUser } = useUserSession()
const { success, error } = useNotifications()
const localePath = useLocalePath()

// Define page meta
definePageMeta({
  layout: false,
  middleware: ['guest']
})

// SEO Configuration
useSeo('login')

// Form state
const { state, schema, isValid } = useLoginForm()
const formRef = useTemplateRef('formRef')
const isLoading = ref(false)

// Form submission
const handleSubmit = async (event: FormSubmitEvent<LoginFormState>) => {
  try {
    isLoading.value = true

    const response = await $fetch<ApiResponse<{ user: PublicUser }>>('/api/auth/login', {
      method: 'POST',
      body: event.data
    })

    if (response.statusCode === 200 && response.data) {
      // Refresh user session from server
      await fetchUser()

      // Show success message
      success({
        title: t('auth.login.success.title'),
        message: t('auth.login.success.message')
      })

      // Redirect to home
      await navigateTo(localePath('/'))
    }
  } catch (err: any) {
    // Handle specific errors
    let errorMessage = t('auth.login.error.generic')
    if (err?.statusCode === 401) {
      errorMessage = t('auth.login.error.invalidCredentials')
    }

    error({
      title: t('auth.login.error.title'),
      message: errorMessage
    })
  } finally {
    isLoading.value = false
  }
}
</script>
