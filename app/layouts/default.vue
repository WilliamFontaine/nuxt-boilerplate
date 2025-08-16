<template>
  <UMain>
    <UHeader :to="localePath('/')">
      <template #title>
        <h1 class="text-2xl font-bold">
          <span class="text-primary">{{ appNameParts[0] }}</span>
          <span v-if="appNameParts[1]" class="text-secondary">{{ appNameParts[1] }}</span>
        </h1>
      </template>

      <template #right>
        <!-- User menu when logged in -->
        <UDropdownMenu v-if="loggedIn" :items="items">
          <UAvatar
            :alt="user?.name"
            :src="'https://i.pravatar.cc/150?u=' + user?.email"
            size="sm"
            class="cursor-pointer"
          />
        </UDropdownMenu>

        <!-- Login button when not logged in -->
        <UButton
          v-else
          :to="localePath('/auth/login')"
          color="primary"
          variant="soft"
          size="sm"
          icon="i-lucide-log-in"
        >
          {{ t('auth.login.title') }}
        </UButton>

        <UColorModeButton />
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/WilliamFontaine/nuxt-boilerplate"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </template>
    </UHeader>

    <slot />

    <UFooter>
      <template #left>
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          {{ t('app.footer') }}
        </p>
      </template>

      <template #right>
        <ULocaleSelect
          v-model="locale"
          :locales="Object.values(locales)"
          @update:model-value="setLocale($event)"
        />
      </template>
    </UFooter>
  </UMain>
</template>

<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'

const { loggedIn, user, clear } = useUserSession()
const { locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()
const { t } = useI18n()
const { success } = useNotifications()

// Functions
const handleLogout = async () => {
  try {
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

// Computed properties
const appNameParts = computed(() => {
  const name = t('app.name')
  return name.split(' ')
})

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: user.value?.name || user.value?.email,
      type: 'label',
      avatar: {
        src: `https://i.pravatar.cc/150?u=${user.value?.email}`
      }
    }
  ],
  [
    {
      label: t('auth.logout.title'),
      icon: 'i-lucide-log-out',
      onSelect: handleLogout
    }
  ]
])

// Head configuration
useHead({
  title: t('app.name'),
  meta: [
    { name: 'description', content: t('app.description') },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>
