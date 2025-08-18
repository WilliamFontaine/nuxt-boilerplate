<template>
  <UModal
    v-model:open="open"
    :title="t('articleForm.actions.delete.title')"
    :description="t('articleForm.actions.delete.description')"
    :dismissible="!loading"
    class="backdrop-blur-sm"
  >
    <template #footer>
      <div
        class="flex flex-col w-full p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border-t border-red-200 dark:border-red-800"
      >
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 text-red-600 dark:text-red-400" />
          <span class="text-xs text-gray-600 dark:text-gray-300 font-medium">
            {{ t('articleForm.actions.delete.info') }}
          </span>
        </div>
        <div class="flex gap-3 self-end">
          <UButton
            type="button"
            color="secondary"
            variant="outline"
            :label="t('articleForm.actions.delete.cancel')"
            icon="i-lucide-x"
            :disabled="loading"
            class="transition-all duration-300 hover:scale-105"
            @click="open = false"
          />
          <UButton
            type="button"
            color="error"
            variant="solid"
            :label="t('articleForm.actions.delete.confirm')"
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
      title: t('articleForm.actions.delete.success.title'),
      message: t('articleForm.actions.delete.success.message')
    })
    emit('close', { success: true })
    open.value = false
  } catch (err: any) {
    const errorCode = getErrorCode(err)

    switch (errorCode) {
      case ERROR_CODES.AUTH.UNAUTHORIZED:
        error({
          title: t('articleForm.actions.delete.error.title'),
          message: t('articleForm.error.unauthorized')
        })
        break

      case ERROR_CODES.RESOURCE.NOT_FOUND:
        error({
          title: t('articleForm.actions.delete.error.title'),
          message: t('articleForm.error.notFound')
        })
        break

      default:
        error({
          title: t('articleForm.actions.delete.error.title'),
          message: t('articleForm.actions.delete.error.message')
        })
    }
  } finally {
    loading.value = false
  }
}
</script>
