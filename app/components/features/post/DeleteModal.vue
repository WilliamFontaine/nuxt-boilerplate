<template>
  <UModal
    v-model:open="open"
    :title="t('articles.form.delete.title')"
    :description="t('articles.form.delete.description')"
    :dismissible="!loading"
    class="backdrop-blur-sm"
  >
    <template #footer>
      <div
        class="flex flex-col w-full p-6 bg-error-50 dark:bg-error-950/20 rounded-lg border-t border-error-200 dark:border-error-800"
      >
        <div class="flex items-center gap-2 mb-4">
          <UIcon
            name="i-lucide-alert-triangle"
            class="w-4 h-4 text-error-600 dark:text-error-400"
          />
          <span class="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
            {{ t('articles.form.delete.info') }}
          </span>
        </div>
        <div class="flex gap-3 self-end">
          <UButton
            type="button"
            color="secondary"
            variant="outline"
            :label="t('global.actions.cancel')"
            icon="i-lucide-x"
            :disabled="loading"
            class="transition-all duration-300 hover:scale-105"
            @click="open = false"
          />
          <UButton
            type="button"
            color="error"
            variant="solid"
            :label="t('articles.form.delete.confirm')"
            icon="i-lucide-trash-2"
            :loading="loading"
            class="transition-all duration-300 hover:scale-105"
            @click="handleDelete"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { getErrorCode } = useApiError()
const { success, error } = useNotifications()

interface Props {
  post?: Post
}

const props = withDefaults(defineProps<Props>(), {
  post: undefined
})

const emit = defineEmits(['close'])
const open = defineModel<boolean>('open', { required: true })
const loading = ref(false)

const handleDelete = async () => {
  if (!props.post) return
  loading.value = true
  try {
    await $fetch(`/api/posts/${props.post.id}`, { method: 'DELETE' })
    success({
      title: t('articles.form.messages.success.delete.title'),
      message: t('articles.form.messages.success.delete.message')
    })
    emit('close', { success: true })
    open.value = false
  } catch (err: any) {
    const errorCode = getErrorCode(err)

    switch (errorCode) {
      case ERROR_CODES.AUTH.UNAUTHORIZED:
        error({
          title: t('articles.form.messages.error.delete.title'),
          message: t('articles.form.messages.error.unauthorized')
        })
        break

      case ERROR_CODES.RESOURCE.NOT_FOUND:
        error({
          title: t('articles.form.messages.error.delete.title'),
          message: t('articles.form.messages.error.notFound')
        })
        break

      default:
        error({
          title: t('articles.form.messages.error.delete.title'),
          message: t('articles.form.messages.error.delete.message')
        })
    }
  } finally {
    loading.value = false
  }
}
</script>
