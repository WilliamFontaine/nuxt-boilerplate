<template>
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

      <div class="flex justify-end">
        <UButton type="submit" color="primary" :loading="loading">
          {{ t('form.post.submit') }}
        </UButton>
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts">
const { state, schema, resetState } = usePostForm()
const loading = ref(false)
const { t } = useI18n()

const emit = defineEmits<(e: 'refresh') => void>()

const onSubmit = async () => {
  loading.value = true
  try {
    await $fetch<ApiResponse<Post>>('/api/posts', {
      method: 'POST',
      body: state
    })
    useNotifications().success({
      title: t('form.post.success.create.title'),
      message: t('form.post.success.create.message')
    })
    resetState()
    emit('refresh')
  } catch {
    useNotifications().error({
      title: t('form.post.error.create.title'),
      message: t('form.post.error.create.message')
    })
  } finally {
    loading.value = false
  }
}
</script>
