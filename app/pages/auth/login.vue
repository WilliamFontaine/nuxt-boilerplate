<template>
  <div
    class="min-h-screen bg-linear-to-br from-primary-50 via-secondary-50/50 to-primary-100/50 dark:from-primary-950 dark:via-secondary-950/50 dark:to-primary-900/50 flex items-center justify-center p-6"
  >
    <div class="w-full max-w-md">
      <!-- Login card -->
      <UPageCard class="shadow-xl border-0 bg-white dark:bg-neutral-900">
        <!-- Back button -->
        <UButton
          color="primary"
          variant="ghost"
          :label="t('global.actions.cancel')"
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
            {{ t('auth.login.links.noAccount') }}
            <ULink :to="localePath('/auth/register')" class="text-primary font-medium">
              {{ t('auth.login.links.register') }} </ULink
            >.
          </template>

          <template #password-hint>
            <ULink
              :to="localePath('/auth/forgot-password')"
              class="text-primary font-medium"
              tabindex="-1"
            >
              {{ t('auth.login.links.forgotPassword') }}
            </ULink>
          </template>

          <template #footer>
            {{ t('auth.login.links.didntReceiveEmail') }}
            <ULink :to="localePath('/auth/resend-verification')" class="text-primary font-medium">
              {{ t('auth.login.links.resendVerification') }} </ULink
            >.
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
const { getErrorData, getErrorCode } = useApiError()
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
    label: t('auth.login.fields.email.label'),
    placeholder: t('auth.login.fields.email.placeholder'),
    required: true,
    defaultValue: state.email,
    autofocus: true
  },
  {
    name: 'password',
    type: 'password' as const,
    label: t('auth.login.fields.password.label'),
    placeholder: t('auth.login.fields.password.placeholder'),
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
const handleSubmit = async (event: FormSubmitEvent<LoginData>) => {
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
        title: t('auth.login.messages.success.title'),
        message: t('auth.login.messages.success.message')
      })

      // Redirect to home
      await navigateTo(localePath('/'))
    }
  } catch (err: any) {
    const errorCode = getErrorCode(err)
    const data = getErrorData(err)

    switch (errorCode) {
      case ERROR_CODES.RATE_LIMIT.EXCEEDED:
      case ERROR_CODES.RATE_LIMIT.TOO_MANY_ATTEMPTS:
        error({
          title: t('auth.login.messages.error.title'),
          message: t('auth.login.messages.rateLimit.tooManyAttempts', {
            minutes: data.minutes || 0,
            seconds: data.seconds || 0
          })
        })
        break

      case ERROR_CODES.AUTH.EMAIL_NOT_VERIFIED:
        error({
          title: t('auth.login.messages.error.title'),
          message: t('auth.login.messages.error.emailNotVerified')
        })
        break

      case ERROR_CODES.AUTH.INVALID_CREDENTIALS:
        // Check for remaining attempts data
        if (data.remainingAttempts !== undefined) {
          error({
            title: t('auth.login.messages.error.title'),
            message: t('auth.login.messages.rateLimit.warning', { count: data.remainingAttempts })
          })
        } else {
          error({
            title: t('auth.login.messages.error.title'),
            message: t('auth.login.messages.error.invalidCredentials')
          })
        }
        break

      default:
        error({
          title: t('auth.login.messages.error.title'),
          message: t('auth.login.messages.error.invalidCredentials')
        })
    }
  } finally {
    isLoading.value = false
  }
}
</script>
