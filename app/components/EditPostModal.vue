<template>
  <UModal v-model:open="open" :title="t('form.post.edit.title')" :dismissible="!loading">
    <template #body>
      <UForm :state="state" :schema="schema" @submit="onSubmit">
        <div class="space-y-4">
          <FormFieldInput
            v-model="state.title"
            name="title"
            :label="t('form.post.title.label')"
            :placeholder="t('form.post.title.placeholder')"
            required
          />

          <FormFieldTextarea
            v-model="state.content"
            name="content"
            :label="t('form.post.content.label')"
            :placeholder="t('form.post.content.placeholder')"
            :rows="5"
            required
          />
        </div>
      </UForm>
    </template>

    <template #footer="{ close }">
      <div class="flex w-full justify-end gap-x-3">
        <UButton
          color="neutral"
          variant="outline"
          :label="t('form.post.edit.cancel')"
          :disabled="loading"
          data-testid="cancel-button"
          @click="close"
        />
        <UButton
          color="primary"
          :label="t('form.post.edit.save')"
          :loading="loading"
          data-testid="save-button"
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { t } = useI18n()

interface Props {
  post: Post
}

const props = defineProps<Props>()

const emit = defineEmits<(e: 'success') => void>()

const open = defineModel<boolean>('open', { required: true })

const { state, schema, setState } = usePostForm()
const loading = ref(false)

watch(
  () => props.post,
  (newPost) => {
    if (!newPost) return
    setState(newPost)
  },
  { immediate: true }
)

const onSubmit = async () => {
  if (!props.post) return

  loading.value = true
  try {
    await $fetch<ApiResponse<Post>>(`/api/posts/${props.post.id}`, {
      method: 'PUT',
      body: state
    })

    useNotifications().success({
      title: t('form.post.success.update.title'),
      message: t('form.post.success.update.message')
    })

    emit('success')
    open.value = false
  } catch {
    useNotifications().error({
      title: t('form.post.error.update.title'),
      message: t('form.post.error.update.message')
    })
  } finally {
    loading.value = false
  }
}
</script>
