<template>
  <div class="relative">
    <div v-if="loggedIn" class="flex items-center gap-2">
      <UAvatar :alt="user?.name" size="sm" />

      <UButton variant="ghost" color="primary" size="sm" @click="handleLogout">
        <UIcon name="i-lucide:log-out" class="size-4" />
        {{ t('auth.logout.title') }}
      </UButton>
    </div>

    <!-- Unauthenticated State -->
    <div v-else class="flex items-center gap-2">
      <UButton :to="localePath('/auth/login')" variant="ghost" color="primary" size="sm">
        {{ t('auth.login.title') }}
      </UButton>
      <UButton :to="localePath('/auth/register')" color="primary" size="sm">
        {{ t('auth.register.title') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { loggedIn, user, clear } = useUserSession()
const { success } = useNotifications()

const handleLogout = async () => {
  try {
    // Clear user session
    clear()

    await $fetch('/api/auth/logout', { method: 'POST' })

    success({
      title: t('auth.logout.success.title'),
      message: t('auth.logout.success.message')
    })

    await navigateTo(localePath('/'))
  } catch {
    // Handle logout error silently
  }
}
</script>
