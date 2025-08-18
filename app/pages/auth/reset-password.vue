<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50/50 to-primary-100/50 dark:from-primary-950 dark:via-secondary-950/50 dark:to-primary-900/50 flex items-center justify-center p-6"
  >
    <div class="w-full max-w-md">
      <!-- Reset password card -->
      <UPageCard class="shadow-xl border-0 bg-white dark:bg-gray-900">
        <!-- Back button -->
        <UButton
          color="primary"
          variant="ghost"
          :label="t('auth.resetPassword.cancel')"
          icon="i-lucide-arrow-left"
          :disabled="isLoading"
          class="w-fit mb-6 cursor-pointer"
          @click="navigateTo(localePath('/auth/login'))"
        />

        <!-- Auth form -->
        <UAuthForm
          :title="t('auth.resetPassword.title')"
          icon="i-lucide-lock"
          :fields="fields"
          :schema="schema"
          :state="state"
          :submit="submitConfig"
          @submit="handleSubmit"
        >
          <template #description>
            {{ t('auth.resetPassword.remembered') }}
            <ULink :to="localePath('/auth/login')" class="text-primary font-medium">
              {{ t('auth.resetPassword.backToLogin') }} </ULink
            >.
          </template>

          <template #footer>
            {{ t('auth.resetPassword.subtitle') }}
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
const route = useRoute()

// =============================================================================
// PAGE CONFIGURATION
// =============================================================================
definePageMeta({
  layout: false,
  middleware: ['guest']
})

useSeo('resetPassword')

// =============================================================================
// FORM CONFIGURATION
// =============================================================================
const { state, schema } = useResetPasswordForm()
const isLoading = ref(false)

// Auto-fill token from URL query parameter
onMounted(() => {
  const token = route.query.token as string
  if (token) {
    state.token = token
  } else {
    // Redirect to forgot password if no token
    navigateTo(localePath('/auth/forgot-password'))
  }
})

// Fields configuration
const fields = computed(() => [
  {
    name: 'token',
    type: 'hidden' as const,
    defaultValue: (route.query.token as string) || ''
  },
  {
    name: 'password',
    type: 'password' as const,
    label: t('auth.resetPassword.password.label'),
    placeholder: t('auth.resetPassword.password.placeholder'),
    required: true,
    defaultValue: state.password,
    autofocus: true
  },
  {
    name: 'confirmPassword',
    type: 'password' as const,
    label: t('auth.resetPassword.confirmPassword.label'),
    placeholder: t('auth.resetPassword.confirmPassword.placeholder'),
    required: true,
    defaultValue: state.confirmPassword
  }
])

// Submit button configuration
const submitConfig = computed(() => ({
  label: t('auth.resetPassword.submit'),
  icon: 'i-lucide-key',
  loading: isLoading.value,
  disabled: isLoading.value
}))

// Form submission
const handleSubmit = async (event: FormSubmitEvent<ResetPasswordFormState>) => {
  try {
    isLoading.value = true

    const response = await $fetch<ApiResponse<{ message: string; email: string }>>(
      '/api/auth/reset-password',
      {
        method: 'POST',
        body: event.data
      }
    )

    if (response.statusCode === 200) {
      // Show success message
      success({
        title: t('auth.resetPassword.success.title'),
        message: t('auth.resetPassword.success.message')
      })

      // Redirect to login
      await navigateTo(localePath('/auth/login'))
    }
  } catch (err: any) {
    // Handle specific errors
    let errorMessage = t('auth.resetPassword.error.generic')
    if (err?.statusCode === 400) {
      errorMessage = t('auth.resetPassword.error.invalidToken')
    }

    error({
      title: t('auth.resetPassword.error.title'),
      message: errorMessage
    })
  } finally {
    isLoading.value = false
  }
}
</script>
