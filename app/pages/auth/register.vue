<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50/50 to-primary-100/50 dark:from-primary-950 dark:via-secondary-950/50 dark:to-primary-900/50 flex items-center justify-center p-6"
  >
    <div class="w-full max-w-md">
      <!-- Registration card -->
      <UPageCard class="shadow-xl border-0 bg-white dark:bg-gray-900">
        <!-- Back button -->
        <UButton
          color="primary"
          variant="ghost"
          :label="t('auth.register.cancel')"
          icon="i-lucide-arrow-left"
          :disabled="isLoading"
          class="w-fit mb-6 cursor-pointer"
          @click="navigateTo(localePath('/'))"
        />

        <!-- Auth form -->
        <UAuthForm
          :title="t('auth.register.title')"
          icon="i-lucide-user-plus"
          :fields="fields"
          :schema="schema"
          :state="state"
          :submit="submitConfig"
          @submit="handleSubmit"
        >
          <template #description>
            <p class="text-gray-600 dark:text-gray-400 text-center">
              {{ t('auth.register.subtitle') }}
            </p>
          </template>

          <template #footer>
            <div
              class="text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
            >
              {{ t('auth.register.hasAccount') }}
              <ULink
                :to="localePath('/auth/login')"
                class="text-primary-600 dark:text-primary-400 font-semibold ml-1 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                {{ t('auth.register.login') }}
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

useSeo('register')

// =============================================================================
// FORM CONFIGURATION
// =============================================================================
const { state, schema } = useRegisterForm()
const isLoading = ref(false)

// Fields configuration
const fields = computed(() => [
  {
    name: 'name',
    type: 'text' as const,
    label: t('auth.register.name.label'),
    placeholder: t('auth.register.name.placeholder'),
    required: true,
    defaultValue: state.name,
    autofocus: true
  },
  {
    name: 'email',
    type: 'email' as const,
    label: t('auth.register.email.label'),
    placeholder: t('auth.register.email.placeholder'),
    required: true,
    defaultValue: state.email
  },
  {
    name: 'password',
    type: 'password' as const,
    label: t('auth.register.password.label'),
    placeholder: t('auth.register.password.placeholder'),
    required: true,
    defaultValue: state.password
  },
  {
    name: 'confirmPassword',
    type: 'password' as const,
    label: t('auth.register.confirmPassword.label'),
    placeholder: t('auth.register.confirmPassword.placeholder'),
    required: true,
    defaultValue: state.confirmPassword
  }
])

// Submit button configuration
const submitConfig = computed(() => ({
  label: t('auth.register.submit'),
  icon: 'i-lucide-user-plus',
  loading: isLoading.value,
  disabled: isLoading.value
}))

// Form submission
const handleSubmit = async (event: FormSubmitEvent<RegisterFormState>) => {
  try {
    isLoading.value = true

    const response = await $fetch<ApiResponse<{ user: PublicUser }>>('/api/auth/register', {
      method: 'POST',
      body: event.data
    })

    if (response.statusCode === 201 && response.data) {
      // Refresh user session from server
      await fetchUser()

      // Show success message
      success({
        title: t('auth.register.success.title'),
        message: t('auth.register.success.message')
      })

      // Redirect to home
      await navigateTo(localePath('/'))
    }
  } catch (err: any) {
    // Handle specific errors
    let errorMessage = t('auth.register.error.generic')
    if (err?.statusCode === 409) {
      errorMessage = t('auth.register.error.emailExists')
    }

    error({
      title: t('auth.register.error.title'),
      message: errorMessage
    })
  } finally {
    isLoading.value = false
  }
}
</script>
