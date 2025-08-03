<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
  >
    <UContainer class="max-w-md">
      <UCard class="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <template #header>
          <div class="text-center space-y-2">
            <UIcon
              name="i-lucide:user-plus"
              class="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400"
            />
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ t('auth.register.title') }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('auth.register.subtitle') }}
            </p>
          </div>
        </template>

        <UForm ref="formRef" :schema="schema" :state="state" @submit="handleSubmit">
          <div class="space-y-6">
            <UiFormInput
              v-model="state.name"
              :label="t('auth.register.name.label')"
              :placeholder="t('auth.register.name.placeholder')"
              name="name"
              type="text"
              required
            >
              <template #leading>
                <UIcon name="i-lucide:user" class="size-6" />
              </template>
            </UiFormInput>

            <UiFormEmail
              v-model="state.email"
              :label="t('auth.register.email.label')"
              :placeholder="t('auth.register.email.placeholder')"
              name="email"
              required
            />

            <UiFormPassword
              v-model="state.password"
              :label="t('auth.register.password.label')"
              :placeholder="t('auth.register.password.placeholder')"
              name="password"
              required
            />

            <UiFormPassword
              v-model="state.confirmPassword"
              :label="t('auth.register.confirmPassword.label')"
              :placeholder="t('auth.register.confirmPassword.placeholder')"
              name="confirmPassword"
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
                :label="t('auth.register.cancel')"
                icon="i-lucide-x"
                :disabled="isLoading"
                @click="navigateTo(localePath('/'))"
              />
              <UButton
                type="submit"
                color="primary"
                :label="t('auth.register.submit')"
                :loading="isLoading"
                :disabled="isLoading || !isValid"
                icon="i-lucide-user-plus"
                @click="formRef?.submit()"
              />
            </div>

            <div class="text-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="space-y-2">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ t('auth.register.hasAccount') }}
                </p>
                <NuxtLink
                  :to="localePath('/auth/login')"
                  class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                >
                  {{ t('auth.register.login') }}
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
useSeo('register')

// Form state
const formRef = useTemplateRef('formRef')
const { state, schema, isValid } = useRegisterForm()
const isLoading = ref(false)

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
