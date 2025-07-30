<template>
  <UModal
    v-model:open="open"
    :dismissible="!loading"
    :title="isEditing ? t('postForm.actions.edit.title') : t('postForm.actions.create.title')"
    :description="
      isEditing ? t('postForm.actions.edit.description') : t('postForm.actions.create.description')
    "
  >
    <UButton
      size="lg"
      color="primary"
      :label="isEditing ? t('postForm.actions.edit.title') : t('postForm.actions.create.title')"
      :icon="isEditing ? 'i-lucide-edit' : 'i-lucide-plus'"
      class="shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 bg-white text-primary-600 hover:bg-gray-50"
      @click="open = true"
    />

    <template #body>
      <UForm ref="form" :state="state" :schema="schema" @submit="onSubmit">
        <div class="space-y-6">
          <FormFieldInput
            v-model="state.title"
            name="title"
            :label="t('postForm.fields.title.label')"
            :placeholder="t('postForm.fields.title.placeholder')"
            required
            size="lg"
          />
          <FormFieldTextarea
            v-model="state.content"
            name="content"
            :label="t('postForm.fields.content.label')"
            :placeholder="t('postForm.fields.content.placeholder')"
            :rows="8"
            required
            size="lg"
            :maxlength="1000"
          />

          <div class="space-y-4">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <UIcon name="i-lucide-type" class="w-4 h-4" />
                  <span>{{
                    t('postForm.analytics.characterCount', { count: state.content.length })
                  }}</span>
                </div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <UIcon name="i-lucide-book-open" class="w-4 h-4" />
                  <span>{{ t('postForm.analytics.wordCount', { count: wordCount }) }}</span>
                </div>
                <div
                  v-if="readingTime > 0"
                  class="flex items-center gap-1 text-gray-500 dark:text-gray-400"
                >
                  <UIcon name="i-lucide-clock" class="w-4 h-4" />
                  <span>{{ t('postForm.analytics.readingTime', { count: readingTime }) }}</span>
                </div>
              </div>
              <UBadge :label="getBadgeLabel()" :color="getBadgeColor()" variant="soft" />
            </div>
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="flex flex-col w-full">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-info" class="w-4 h-4 text-gray-400" />
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{
              isEditing
                ? t('postForm.actions.edit.autoSaveInfo')
                : t('postForm.actions.create.autoSaveInfo')
            }}
          </span>
        </div>
        <div class="flex gap-3 self-end mt-4">
          <UButton
            type="button"
            color="neutral"
            variant="outline"
            :label="
              isEditing ? t('postForm.actions.edit.cancel') : t('postForm.actions.create.cancel')
            "
            icon="i-lucide-x"
            :disabled="loading"
            @click="open = false"
          />
          <UButton
            type="submit"
            color="primary"
            :label="
              isEditing ? t('postForm.actions.edit.save') : t('postForm.actions.create.submit')
            "
            :loading="loading"
            :icon="isEditing ? 'i-lucide-save' : 'i-lucide-plus'"
            @click="form?.submit()"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const { t } = useI18n()

interface Props {
  post?: Post
  mode?: 'create' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  post: undefined,
  mode: 'create'
})

const emit = defineEmits(['close'])

const open = defineModel<boolean>('open', { required: true })

const { state, schema, setState, resetState } = usePostForm()

const form = useTemplateRef('form')
const loading = ref(false)

const isEditing = computed(() => props.mode === 'edit' || !!props.post)

const wordCount = computed(
  () => state.content.split(/\s+/).filter((word) => word.length > 0).length
)

const readingTime = computed(() => {
  const wordsPerMinute = 200
  if (wordCount.value === 0) return 0
  return Math.max(1, Math.ceil(wordCount.value / wordsPerMinute))
})

const getBadgeLabel = () => {
  const length = state.content.length
  if (length > 500) return t('postForm.badgeLabels.length.long')
  if (length > 200) return t('postForm.badgeLabels.length.medium')
  return t('postForm.badgeLabels.length.short')
}

const getBadgeColor = () => {
  const length = state.content.length
  if (length > 500) return 'success'
  if (length > 200) return 'primary'
  return 'neutral'
}

const stopPostWatcher = watch(
  () => props.post,
  (newPost) => {
    if (newPost && isEditing.value) setState(newPost)
  },
  { immediate: true }
)

const stopOpenWatcher = watch(
  () => open.value,
  (isOpen) => {
    if (isOpen) {
      if (!isEditing.value) {
        resetState()
      } else if (props.post) {
        setState(props.post)
      }
    }
  }
)

onUnmounted(() => {
  stopPostWatcher()
  stopOpenWatcher()
})

const onSubmit = async (event: FormSubmitEvent<PostFormState>) => {
  if (isEditing.value && !props.post) return

  loading.value = true
  try {
    if (isEditing.value) {
      await $fetch<ApiResponse<Post>>(`/api/posts/${props.post!.id}`, {
        method: 'PUT',
        body: event.data
      })
      useNotifications().success({
        title: t('postForm.actions.edit.success.title'),
        message: t('postForm.actions.edit.success.message')
      })
    } else {
      await $fetch<ApiResponse<Post>>('/api/posts', {
        method: 'POST',
        body: event.data
      })
      useNotifications().success({
        title: t('postForm.actions.create.success.title'),
        message: t('postForm.actions.create.success.message')
      })
      resetState()
    }
    emit('close', { success: true })
    open.value = false
  } catch {
    const errorTitle = isEditing.value
      ? t('postForm.actions.edit.error.title')
      : t('postForm.actions.create.error.title')
    const errorMessage = isEditing.value
      ? t('postForm.actions.edit.error.message')
      : t('postForm.actions.create.error.message')

    useNotifications().error({
      title: errorTitle,
      message: errorMessage
    })
  } finally {
    loading.value = false
  }
}
</script>
