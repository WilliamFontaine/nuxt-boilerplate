<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50/50 to-primary-100/50 dark:from-primary-950 dark:via-secondary-950/50 dark:to-primary-900/50 flex items-center justify-center p-6"
  >
    <div class="w-full max-w-md">
      <!-- Login card -->
      <UPageCard class="shadow-xl border-0 bg-white dark:bg-gray-900">
        <!-- Back button -->
        <UButton
          color="primary"
          variant="ghost"
          :label="t('auth.login.cancel')"
          icon="i-lucide-arrow-left"
          :disabled="isLoading"
          class="w-fit mb-6 cursor-pointer"
          @click="navigateTo(localePath('/'))"
        />

        <!-- Auth form -->
        <UAuthForm
          :title="t('auth.login.title')"
          icon="i-lucide-lock-keyhole"
          :fields="fields"
          :schema="schema"
          :state="state"
          :submit="submitConfig"
          @submit="handleSubmit"
        >
          <template #description>
            <p class="text-gray-600 dark:text-gray-400 text-center">
              {{ t('auth.login.subtitle') }}
            </p>
          </template>

          <template #footer>
            <div
              class="text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
            >
              {{ t('auth.login.noAccount') }}
              <ULink
                :to="localePath('/auth/register')"
                class="text-primary-600 dark:text-primary-400 font-semibold ml-1 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                {{ t('auth.login.register') }}
              </ULink>
            </div>
          </template>
        </UAuthForm>
      </UPageCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

// =============================================================================
// COMPOSABLES & DEPENDENCIES
// =============================================================================
const { t } = useI18n()
const { fetch: fetchUser } = useUserSession()
const { success, error } = useNotifications()
const localePath = useLocalePath()

// =============================================================================
// PAGE CONFIGURATION
// =============================================================================
definePageMeta({
  layout: false,
  middleware: ['guest']
})

useSeo('login')

// =============================================================================
// FORM CONFIGURATION
// =============================================================================
const { state, schema } = useLoginForm()
const isLoading = ref(false)

// Fields configuration
const fields = computed(() => [
  {
    name: 'email',
    type: 'email' as const,
    label: t('auth.login.email.label'),
    placeholder: t('auth.login.email.placeholder'),
    required: true,
    defaultValue: state.email,
    autofocus: true
  },
  {
    name: 'password',
    type: 'password' as const,
    label: t('auth.login.password.label'),
    placeholder: t('auth.login.password.placeholder'),
    required: true,
    defaultValue: state.password
  }
])

// Submit button configuration
const submitConfig = computed(() => ({
  label: t('auth.login.submit'),
  icon: 'i-lucide-log-in',
  loading: isLoading.value,
  disabled: isLoading.value
}))

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
    // Handle rate limiting (429)
    if (err?.statusCode === 429) {
      const data = err.data?.data || err.data || {}
      const minutes = data.minutes || 0
      const seconds = data.seconds || 0

      error({
        title: t('auth.login.error.title'),
        message: t('auth.login.rateLimit.tooManyAttempts', { minutes, seconds })
      })
      return
    }

    // Handle remaining attempts warning (401 with remainingAttempts)
    const remainingAttempts = err?.data?.data?.remainingAttempts
    if (err?.statusCode === 401 && remainingAttempts !== undefined) {
      error({
        title: t('auth.login.error.title'),
        message: t('auth.login.rateLimit.warning', { count: remainingAttempts })
      })
      return
    }

    // Fallback for all other errors (should rarely happen)
    error({
      title: t('auth.login.error.title'),
      message: t('auth.login.error.invalidCredentials')
    })
  } finally {
    isLoading.value = false
  }
}
</script>
