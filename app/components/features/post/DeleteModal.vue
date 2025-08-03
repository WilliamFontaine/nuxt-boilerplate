<template>
  <UModal
    v-model:open="open"
    :title="t('articleForm.actions.delete.title')"
    :description="t('articleForm.actions.delete.description')"
    :dismissible="!loading"
  >
    <template #footer>
      <div class="flex flex-col w-full">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-info" class="w-4 h-4 text-gray-400" />
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ t('articleForm.actions.delete.info') }}
          </span>
        </div>
        <div class="flex gap-3 self-end mt-4">
          <UButton
            type="button"
            color="neutral"
            variant="outline"
            :label="t('articleForm.actions.delete.cancel')"
            icon="i-lucide-x"
            :disabled="loading"
            @click="open = false"
          />
          <UButton
            type="button"
            color="error"
            variant="solid"
            :label="t('articleForm.actions.delete.confirm')"
            icon="i-lucide-trash-2"
            :loading="loading"
            @click="handleDelete"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { t } = useI18n()

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
    useNotifications().success({
      title: t('articleForm.actions.delete.success.title'),
      message: t('articleForm.actions.delete.success.message')
    })
    emit('close', { success: true })
    open.value = false
  } catch {
    useNotifications().error({
      title: t('articleForm.actions.delete.error.title'),
      message: t('articleForm.actions.delete.error.message')
    })
  } finally {
    loading.value = false
  }
}
</script>
