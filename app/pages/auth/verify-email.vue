<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50/50 to-primary-100/50 dark:from-primary-950 dark:via-secondary-950/50 dark:to-primary-900/50 flex items-center justify-center p-6"
  >
    <div class="w-full max-w-md">
      <!-- Verification Status Card -->
      <UPageCard class="shadow-xl border-0 bg-white dark:bg-gray-900">
        <!-- Back button (only show if not loading or successful) -->
        <UButton
          v-if="verificationState !== 'loading' && verificationState !== 'success'"
          color="primary"
          variant="link"
          :label="t('auth.verifyEmail.cancel')"
          icon="i-lucide-arrow-left"
          class="w-fit mb-6 cursor-pointer"
          @click="navigateTo(localePath('/'))"
        />

        <!-- Loading State -->
        <div v-if="verificationState === 'loading'" class="text-center py-8">
          <div class="mb-6">
            <UIcon
              name="i-lucide-loader-2"
              class="h-16 w-16 text-primary-500 animate-spin mx-auto"
            />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {{ t('auth.verifyEmail.loading.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ t('auth.verifyEmail.loading.subtitle') }}
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="verificationState === 'success'" class="text-center py-8">
          <div class="mb-6">
            <UIcon
              name="i-lucide-check-circle"
              class="h-16 w-16 text-green-500 mx-auto animate-bounce"
            />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {{ t('auth.verifyEmail.success.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ t('auth.verifyEmail.success.subtitle') }}
          </p>

          <!-- Countdown and redirect -->
          <div class="text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {{ t('auth.verifyEmail.success.redirecting', { seconds: redirectCountdown }) }}
            </p>
            <UProgress :value="((5 - redirectCountdown) / 5) * 100" class="mb-4" />

            <UButton
              color="primary"
              :label="t('actions.continueNow')"
              icon="i-lucide-arrow-right"
              size="lg"
              class="w-full justify-center"
              @click="navigateTo(localePath('/'))"
            />
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="verificationState === 'error'" class="text-center py-8">
          <div class="mb-6">
            <UIcon name="i-lucide-x-circle" class="h-16 w-16 text-red-500 mx-auto animate-pulse" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {{ t('auth.verifyEmail.error.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ errorMessage }}
          </p>

          <div class="space-y-3">
            <UButton
              color="primary"
              :label="t('auth.verifyEmail.error.retry')"
              icon="i-lucide-refresh-cw"
              size="lg"
              class="w-full justify-center"
              @click="retryVerification"
            />

            <UButton
              color="neutral"
              variant="outline"
              :label="t('auth.verifyEmail.error.resendLink')"
              icon="i-lucide-mail"
              size="lg"
              class="w-full justify-center"
              @click="navigateTo(localePath('/auth/resend-verification'))"
            />
          </div>
        </div>

        <!-- No Token State -->
        <div v-else class="text-center py-8">
          <div class="mb-6">
            <UIcon name="i-lucide-mail-x" class="h-16 w-16 text-gray-400 mx-auto" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {{ t('auth.verifyEmail.noToken.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ t('auth.verifyEmail.noToken.subtitle') }}
          </p>

          <div class="space-y-3">
            <UButton
              color="primary"
              :label="t('auth.verifyEmail.noToken.resendButton')"
              icon="i-lucide-mail"
              size="lg"
              class="w-full justify-center"
              @click="navigateTo(localePath('/auth/resend-verification'))"
            />

            <UButton
              color="neutral"
              variant="outline"
              :label="t('auth.verifyEmail.noToken.backButton')"
              icon="i-lucide-arrow-left"
              size="lg"
              class="w-full justify-center"
              @click="navigateTo(localePath('/auth/login'))"
            />
          </div>
        </div>
      </UPageCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// =============================================================================
// COMPOSABLES & DEPENDENCIES
// =============================================================================
const { t } = useI18n()
const { fetch: fetchUser } = useUserSession()
const { success } = useNotifications()
const { getErrorCode } = useApiError()
const localePath = useLocalePath()
const route = useRoute()

// =============================================================================
// PAGE CONFIGURATION
// =============================================================================
definePageMeta({
  layout: false,
  middleware: ['guest']
})

useSeo('verifyEmail')

// =============================================================================
// STATE MANAGEMENT
// =============================================================================
type VerificationState = 'loading' | 'success' | 'error' | 'notoken'

const verificationState = ref<VerificationState>('notoken')
const errorMessage = ref('')
const redirectCountdown = ref(0)

// =============================================================================
// AUTO-VERIFICATION LOGIC
// =============================================================================
onMounted(async () => {
  const token = route.query.token as string
  if (token) {
    verificationState.value = 'loading'
    await performVerification(token)
  }
})

// =============================================================================
// VERIFICATION FUNCTIONS
// =============================================================================
const performVerification = async (token: string) => {
  try {
    const response = await $fetch<ApiResponse<{ user: PublicUser; loggedIn: boolean }>>(
      '/api/auth/verify-email',
      {
        method: 'POST',
        body: { token }
      }
    )

    if (response.statusCode === 200 && response.data) {
      // Refresh user session from server
      await fetchUser()

      // Show success state
      verificationState.value = 'success'

      // Show success notification
      success({
        title: t('auth.verifyEmail.success.title'),
        message: t('auth.verifyEmail.success.message')
      })

      // Auto-redirect after 3 seconds
      startRedirectCountdown()
    }
  } catch (err: any) {
    const errorCode = getErrorCode(err)

    verificationState.value = 'error'

    switch (errorCode) {
      case ERROR_CODES.AUTH.INVALID_TOKEN:
        errorMessage.value = t('auth.verifyEmail.error.invalidToken')
        break

      case ERROR_CODES.AUTH.TOKEN_EXPIRED:
        errorMessage.value = t('auth.verifyEmail.error.tokenExpired')
        break

      case ERROR_CODES.VALIDATION.ERROR:
        errorMessage.value = t('auth.verifyEmail.error.validationError')
        break

      default:
        errorMessage.value = t('auth.verifyEmail.error.generic')
    }
  }
}

const retryVerification = async () => {
  const token = route.query.token as string
  if (token) {
    verificationState.value = 'loading'
    await performVerification(token)
  }
}

const startRedirectCountdown = () => {
  redirectCountdown.value = 5
  const interval = setInterval(() => {
    redirectCountdown.value--
    if (redirectCountdown.value <= 0) {
      clearInterval(interval)
      navigateTo(localePath('/'))
    }
  }, 1000)
}
</script>
