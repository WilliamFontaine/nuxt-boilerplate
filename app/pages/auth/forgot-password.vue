<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50/50 to-primary-100/50 dark:from-primary-950 dark:via-secondary-950/50 dark:to-primary-900/50 flex items-center justify-center p-6"
  >
    <div class="w-full max-w-md">
      <!-- Forgot password card -->
      <UPageCard class="shadow-xl border-0 bg-white dark:bg-gray-900">
        <!-- Back button -->
        <UButton
          color="primary"
          variant="ghost"
          :label="t('auth.forgotPassword.cancel')"
          icon="i-lucide-arrow-left"
          :disabled="isLoading"
          class="w-fit mb-6 cursor-pointer"
          @click="navigateTo(localePath('/auth/login'))"
        />

        <!-- Auth form -->
        <UAuthForm
          :title="t('auth.forgotPassword.title')"
          icon="i-lucide-key"
          :fields="fields"
          :schema="schema"
          :state="state"
          :submit="submitConfig"
          @submit="handleSubmit"
        >
          <template #description>
            {{ t('auth.forgotPassword.remembered') }}
            <ULink :to="localePath('/auth/login')" class="text-primary font-medium">
              {{ t('auth.forgotPassword.backToLogin') }} </ULink
            >.
          </template>

          <template #footer>
            {{ t('auth.forgotPassword.subtitle') }}
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
const { success, error } = useNotifications()
const localePath = useLocalePath()

// =============================================================================
// PAGE CONFIGURATION
// =============================================================================
definePageMeta({
  layout: false,
  middleware: ['guest']
})

useSeo('forgotPassword')

// =============================================================================
// FORM CONFIGURATION
// =============================================================================
const { state, schema } = useForgotPasswordForm()
const isLoading = ref(false)

// Fields configuration
const fields = computed(() => [
  {
    name: 'email',
    type: 'email' as const,
    label: t('auth.forgotPassword.email.label'),
    placeholder: t('auth.forgotPassword.email.placeholder'),
    required: true,
    defaultValue: state.email,
    autofocus: true
  }
])

// Submit button configuration
const submitConfig = computed(() => ({
  label: t('auth.forgotPassword.submit'),
  icon: 'i-lucide-send',
  loading: isLoading.value,
  disabled: isLoading.value
}))

// Form submission
const handleSubmit = async (event: FormSubmitEvent<ForgotPasswordFormState>) => {
  try {
    isLoading.value = true

    const response = await $fetch<ApiResponse<{ message: string; email: string }>>(
      '/api/auth/forgot-password',
      {
        method: 'POST',
        body: event.data
      }
    )

    if (response.statusCode === 200) {
      // Show success message
      success({
        title: t('auth.forgotPassword.success.title'),
        message: t('auth.forgotPassword.success.message')
      })

      // Stay on the same page, user can try again if needed
    }
  } catch (err: any) {
    // Handle rate limiting (429)
    if (err?.statusCode === 429) {
      // Try different ways to access the error data
      const errorData = err?.data?.data || err?.data || {}
      const minutes = errorData?.remainingMinutes || 0
      const seconds = errorData?.remainingSeconds || 0

      error({
        title: t('auth.forgotPassword.error.title'),
        message: t('auth.forgotPassword.error.tooManyRequests', { minutes, seconds })
      })
      return
    }

    // Handle other errors
    error({
      title: t('auth.forgotPassword.error.title'),
      message: t('auth.forgotPassword.error.generic')
    })
  } finally {
    isLoading.value = false
  }
}
</script>
