<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <div class="flex items-center justify-center">
      <UContainer class="text-center space-y-6 px-4">
        <h1 class="text-4xl font-bold text-primary-500 dark:text-primary-400">
          {{ t('hero.title') }}
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
          {{ t('hero.subtitle') }}
        </p>
      </UContainer>
    </div>

    <UContainer class="py-12">
      <div class="max-w-2xl mx-auto">
        <FormPost @success="refreshPosts" />
      </div>
    </UContainer>

    <UContainer class="py-12">
      <div class="max-w-2xl mx-auto">
        <div class="grid grid-cols-1 gap-4">
          <PostCard v-for="post in posts" :key="post.id" :post="post" @delete="handleDelete" />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()

const { data: response, refresh: refreshPosts } = await useFetch<ApiResponse<Post[]>>('/api/posts')
const posts = computed(() => response.value?.data)

const handleDelete = async (post: Post) => {
  try {
    await $fetch<ApiResponse<Post>>(`/api/posts/${post.id}`, {
      method: 'DELETE'
    })
    useNotifications().success({
      title: t('form.post.success.title'),
      message: t('form.post.success.delete')
    })
    refreshPosts()
  } catch (error) {
    console.error('Failed to delete post:', error)
    useNotifications().error({
      title: t('form.post.error.title'),
      message: t('form.post.error.message')
    })
  }
}
</script>
