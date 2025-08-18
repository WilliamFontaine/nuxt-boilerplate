<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50/50 to-primary-100/50 dark:from-primary-950 dark:via-secondary-950/50 dark:to-primary-900/50 flex items-center justify-center p-6"
  >
    <div class="w-full max-w-md">
      <!-- Resend verification card -->
      <UPageCard class="shadow-xl border-0 bg-white dark:bg-gray-900">
        <!-- Back button -->
        <UButton
          color="primary"
          variant="ghost"
          :label="t('auth.resendVerification.cancel')"
          icon="i-lucide-arrow-left"
          :disabled="isLoading"
          class="w-fit mb-6 cursor-pointer"
          @click="navigateTo(localePath('/auth/login'))"
        />

        <!-- Auth form -->
        <UAuthForm
          :title="t('auth.resendVerification.title')"
          icon="i-lucide-mail"
          :fields="fields"
          :schema="schema"
          :state="state"
          :submit="submitConfig"
          @submit="handleSubmit"
        >
          <template #description>
            {{ t('auth.resendVerification.alreadyVerified') }}
            <ULink :to="localePath('/auth/login')" class="text-primary font-medium">
              {{ t('auth.resendVerification.backToLogin') }} </ULink
            >.
          </template>

          <template #footer>
            {{ t('auth.resendVerification.subtitle') }}
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

useSeo('resendVerification')

// =============================================================================
// FORM CONFIGURATION
// =============================================================================
const { state, schema } = useForgotPasswordForm() // Reuse the same form (just email field)
const isLoading = ref(false)

// Fields configuration
const fields = computed(() => [
  {
    name: 'email',
    type: 'email' as const,
    label: t('auth.resendVerification.email.label'),
    placeholder: t('auth.resendVerification.email.placeholder'),
    required: true,
    defaultValue: state.email,
    autofocus: true
  }
])

// Submit button configuration
const submitConfig = computed(() => ({
  label: t('auth.resendVerification.submit'),
  icon: 'i-lucide-send',
  loading: isLoading.value,
  disabled: isLoading.value
}))

// Form submission
const handleSubmit = async (event: FormSubmitEvent<ForgotPasswordFormState>) => {
  try {
    isLoading.value = true

    const response = await $fetch<ApiResponse<{ message: string; email: string }>>(
      '/api/auth/resend-verification',
      {
        method: 'POST',
        body: event.data
      }
    )

    if (response.statusCode === 200) {
      // Show success message
      success({
        title: t('auth.resendVerification.success.title'),
        message: t('auth.resendVerification.success.message')
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
        title: t('auth.resendVerification.error.title'),
        message: t('auth.resendVerification.error.tooManyRequests', { minutes, seconds })
      })
      return
    }

    // Handle user not found or already verified
    if (err?.statusCode === 404) {
      error({
        title: t('auth.resendVerification.error.title'),
        message: t('auth.resendVerification.error.userNotFound')
      })
      return
    }

    if (err?.statusCode === 400) {
      error({
        title: t('auth.resendVerification.error.title'),
        message: t('auth.resendVerification.error.alreadyVerified')
      })
      return
    }

    // Handle other errors
    error({
      title: t('auth.resendVerification.error.title'),
      message: t('auth.resendVerification.error.generic')
    })
  } finally {
    isLoading.value = false
  }
}
</script>
