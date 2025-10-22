<template>
  <UPage class="bg-primary-50/30 dark:bg-primary-950/30 min-h-screen">
    <!-- Hero section -->
    <UPageHero
      :title="t('pages.hero.title')"
      :description="t('pages.hero.subtitle')"
      :headline="t('pages.hero.feature')"
      color="primary"
      :links="heroLinks"
    />

    <USeparator color="primary" />

    <!-- Main content -->
    <UContainer class="py-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- User preferences -->
          <div
            class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-secondary-200/60 dark:border-secondary-700/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <LayoutPreferencesControls />
          </div>

          <!-- Statistics -->
          <UCard
            class="bg-white dark:bg-neutral-900 shadow-sm border-primary-200/60 dark:border-primary-700/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <template #header>
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center"
                >
                  <UIcon
                    name="i-lucide-bar-chart-3"
                    class="w-5 h-5 text-primary-600 dark:text-primary-400"
                  />
                </div>
                <h3 class="font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ t('pages.dashboard.stats.title') }}
                </h3>
              </div>
            </template>

            <div class="space-y-4">
              <div
                class="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-700/50"
              >
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-file-text"
                    class="w-4 h-4 text-neutral-500 dark:text-neutral-400"
                  />
                  <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">{{
                    t('pages.dashboard.stats.totalPosts')
                  }}</span>
                </div>
                <UBadge :label="posts?.length.toString()" color="primary" variant="soft" />
              </div>
              <div
                class="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-700/50"
              >
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-layout-grid"
                    class="w-4 h-4 text-neutral-500 dark:text-neutral-400"
                  />
                  <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">{{
                    t('preferences.displayMode.label')
                  }}</span>
                </div>
                <UBadge
                  :label="t(`preferences.displayMode.${postViewMode}`)"
                  color="secondary"
                  variant="soft"
                />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Posts section -->
        <div ref="postsRef" class="lg:col-span-3">
          <!-- Posts header -->
          <div
            class="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-primary-200/60 dark:border-primary-700/60 transition-all duration-300 hover:shadow-md"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center"
              >
                <UIcon
                  name="i-lucide-newspaper"
                  class="w-5 h-5 text-primary-600 dark:text-primary-400"
                />
              </div>
              <div>
                <h2 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {{ t('pages.dashboard.title') }}
                </h2>
                <p class="text-neutral-600 dark:text-neutral-400 mt-1">
                  {{ t('pages.dashboard.subtitle') }}
                </p>
              </div>
            </div>
            <!-- Stats inline -->
            <div
              class="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-700/50"
            >
              <div class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <UIcon name="i-lucide-archive" class="w-4 h-4" />
                <span
                  >{{ posts?.length || 0 }} {{ posts?.length === 1 ? 'article' : 'articles' }}</span
                >
              </div>
              <div class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <UIcon name="i-lucide-eye" class="w-4 h-4" />
                <span>{{ t(`preferences.displayMode.${postViewMode}`) }}</span>
              </div>
            </div>
          </div>

          <!-- Posts container -->
          <div
            class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <!-- Posts grid/list with fixed height and scroll -->
            <div v-if="posts && posts.length > 0" class="h-[400px] overflow-y-auto p-6">
              <div
                :class="[
                  'gap-6',
                  postViewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'space-y-4'
                ]"
              >
                <FeaturesPostCard
                  v-for="post in posts"
                  :key="post.id"
                  :post="post"
                  :display-mode="postDisplayMode"
                  :view-mode="postViewMode"
                  @refresh="refreshPosts"
                />
              </div>
            </div>

            <!-- Empty state -->
            <div
              v-else
              class="h-[400px] text-center py-16 px-6 bg-neutral-50 dark:bg-neutral-800 rounded-lg m-6"
            >
              <div
                class="inline-flex p-4 bg-primary-100 dark:bg-primary-900 rounded-full mb-6 shadow-sm transition-transform duration-300 hover:scale-105"
              >
                <UIcon
                  name="i-lucide-file-plus"
                  class="w-8 h-8 text-primary-600 dark:text-primary-400"
                />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
                {{ t('pages.dashboard.empty.title') }}
              </h3>
              <p class="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                {{ t('pages.dashboard.empty.subtitle') }}
              </p>
              <UButton
                :label="t('articles.form.create.title')"
                icon="i-lucide-plus"
                color="primary"
                size="lg"
                class="transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                @click="handleCreatePost"
              />
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </UPage>
</template>

<script lang="ts" setup>
import { FeaturesPostCreateModal } from '#components'
import type { ButtonProps } from '@nuxt/ui'

// Composables and utilities
const { t } = useI18n()
const { postViewMode, postDisplayMode } = usePreferences()
const { user } = useUserSession()
const localePath = useLocalePath()

// SEO configuration
useSeo('home')

// Modal management with overlay
const overlay = useOverlay()
const createModal = overlay.create(FeaturesPostCreateModal)

// Template refs
const postsRef = ref<HTMLElement>()

// Data fetching
const { data: response, refresh: refreshPosts } =
  await useFetch<ApiResponse<PostWithAuthor[]>>('/api/posts')
const posts = computed(() => response.value?.data)

// Navigation and actions
const scrollToPosts = () => {
  postsRef.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleCreatePost = async () => {
  if (!user.value) {
    await navigateTo(localePath('/auth/login'))
    return
  }

  const result = await createModal.open({
    mode: 'create',
    open: false
  }).result

  if (result?.success) {
    refreshPosts()
  }
}

// Hero configuration
const heroLinks: ButtonProps[] = [
  {
    label: t('articles.form.create.title'),
    icon: 'i-lucide-plus',
    color: 'primary',
    class: 'cursor-pointer transition-transform duration-300 hover:scale-102',
    onClick() {
      handleCreatePost()
    }
  },
  {
    label: t('global.actions.viewPosts'),
    icon: 'i-lucide-arrow-down',
    color: 'secondary',
    variant: 'outline',
    class: 'cursor-pointer transition-transform duration-300 hover:scale-102',
    onClick() {
      scrollToPosts()
    }
  }
]
</script>
