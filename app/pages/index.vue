<template>
  <div
    class="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 min-h-screen flex flex-col"
  >
    <!-- Hero Section with Modern Design -->
    <section
      class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 dark:from-primary-700 dark:via-primary-800 dark:to-primary-900 text-white overflow-hidden"
    >
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>

      <div class="relative py-20 text-center">
        <div class="max-w-4xl mx-auto">
          <div
            class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
          >
            <UIcon name="i-lucide-sparkles" class="w-4 h-4 mr-2" />
            <span class="text-sm font-medium">{{ t('hero.modernInterface') }}</span>
          </div>

          <h1
            class="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent"
          >
            {{ t('hero.title') }}
          </h1>

          <p
            class="text-xl md:text-2xl text-primary-100 dark:text-primary-200 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            {{ t('hero.subtitle') }}
          </p>

          <!-- Quick Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <FeaturesPostCreateModal
              v-model:open="createPostModal"
              display-mode="create"
              @close="refreshPosts"
            />

            <UButton
              size="lg"
              color="primary"
              variant="outline"
              icon="i-lucide-arrow-down"
              class="border-white/30 text-white hover:bg-white/10 transition-all duration-200"
              @click="scrollToPosts"
            >
              {{ t('actions.viewPosts') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content with Enhanced Layout -->
    <UContainer class="py-6 flex-grow flex flex-col h-[80vh]">
      <div class="flex flex-1 gap-4 overflow-hidden">
        <!-- Enhanced Sidebar -->
        <div
          class="w-full max-w-xs flex-shrink-0 space-y-8 overflow-y-auto border-r border-gray-200 dark:border-gray-700 p-4"
        >
          <!-- Enhanced Preferences Controls -->
          <LayoutPreferencesControls />

          <!-- Enhanced Stats Card -->
          <UCard class="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <template #header>
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center"
                >
                  <UIcon
                    name="i-lucide-bar-chart-3"
                    class="w-5 h-5 text-success-600 dark:text-success-400"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ t('stats.title') }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ t('stats.subtitle') }}
                  </p>
                </div>
              </div>
            </template>
            <div class="space-y-4">
              <div
                class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-file-text" class="w-4 h-4 text-gray-500" />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t('stats.totalPosts') }}
                  </span>
                </div>
                <UBadge :label="posts?.length.toString()" variant="soft" size="lg" />
              </div>
              <div
                class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-columns" class="w-4 h-4 text-gray-500" />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t('preferences.displayMode.label') }}
                  </span>
                </div>
                <UBadge
                  :label="t(`preferences.displayMode.${postViewMode}`)"
                  :color="postViewMode === 'grid' ? 'success' : 'primary'"
                  variant="soft"
                  size="lg"
                />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Enhanced Posts Content -->
        <div ref="postsRef" class="flex flex-col flex-grow overflow-hidden">
          <!-- Enhanced Posts Header -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 flex-shrink-0"
          >
            <div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {{ t('posts.title') }}
              </h2>
              <p class="text-gray-600 dark:text-gray-400">
                {{ t('posts.subtitle') }}
              </p>
            </div>
          </div>

          <!-- Enhanced Posts Grid/List -->
          <div
            v-if="posts && posts.length > 0"
            class="flex-grow overflow-y-auto p-1 border border-gray-200 dark:border-gray-700 rounded-lg space-y-8"
          >
            <div
              :class="[
                'gap-6 transition-all duration-300',
                postViewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3'
                  : 'grid grid-cols-1'
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

          <!-- Enhanced Empty State -->
          <div v-else class="text-center py-20 flex-shrink-0">
            <UIcon
              name="i-lucide-file-plus"
              class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-6"
            />
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {{ t('posts.empty.title') }}
            </h3>
            <p class="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {{ t('posts.empty.subtitle') }}
            </p>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
const { postViewMode, postDisplayMode } = usePreferences()

// SEO Configuration
useSeo('home')

const createPostModal = ref(false)

// Refs for scroll functionality
const postsRef = ref<HTMLElement>()

const { data: response, refresh: refreshPosts } =
  await useFetch<ApiResponse<PostWithAuthor[]>>('/api/posts')
const posts = computed(() => response.value?.data)

const scrollToPosts = () => {
  postsRef.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>
