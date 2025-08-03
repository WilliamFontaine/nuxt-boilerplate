<template>
  <UModal
    v-model:open="open"
    :dismissible="!isLoading"
    :title="isEditing ? t('articleForm.actions.edit.title') : t('articleForm.actions.create.title')"
    :description="
      isEditing
        ? t('articleForm.actions.edit.description')
        : t('articleForm.actions.create.description')
    "
  >
    <UButton
      size="lg"
      color="primary"
      :label="
        isEditing ? t('articleForm.actions.edit.title') : t('articleForm.actions.create.title')
      "
      :icon="isEditing ? 'i-lucide-edit' : 'i-lucide-plus'"
      class="shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 bg-white text-primary-600 hover:bg-gray-50"
      @click="handleButtonClick"
    />

    <template #body>
      <UForm ref="formRef" :state="state" :schema="schema" @submit="handleSubmit">
        <div class="space-y-6">
          <UiFormInput
            v-model="state.title"
            name="title"
            :label="t('articleForm.fields.title.label')"
            :placeholder="t('articleForm.fields.title.placeholder')"
            required
          />
          <UiFormTextarea
            v-model="state.content"
            name="content"
            :label="t('articleForm.fields.content.label')"
            :placeholder="t('articleForm.fields.content.placeholder')"
            :rows="8"
            required
            :maxlength="1000"
          />

          <div class="space-y-4">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <UIcon name="i-lucide-type" class="w-4 h-4" />
                  <span>{{
                    t('articleForm.analytics.characterCount', { count: state.content.length })
                  }}</span>
                </div>
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <UIcon name="i-lucide-book-open" class="w-4 h-4" />
                  <span>{{ t('articleForm.analytics.wordCount', { count: wordCount }) }}</span>
                </div>
                <div
                  v-if="readingTime > 0"
                  class="flex items-center gap-1 text-gray-500 dark:text-gray-400"
                >
                  <UIcon name="i-lucide-clock" class="w-4 h-4" />
                  <span>{{ t('articleForm.analytics.readingTime', { count: readingTime }) }}</span>
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
                ? t('articleForm.actions.edit.autoSaveInfo')
                : t('articleForm.actions.create.autoSaveInfo')
            }}
          </span>
        </div>
        <div class="flex gap-3 self-end mt-4">
          <UButton
            type="button"
            color="neutral"
            variant="outline"
            :label="
              isEditing
                ? t('articleForm.actions.edit.cancel')
                : t('articleForm.actions.create.cancel')
            "
            icon="i-lucide-x"
            :disabled="isLoading"
            @click="open = false"
          />
          <UButton
            type="submit"
            color="primary"
            :label="
              isEditing
                ? t('articleForm.actions.edit.save')
                : t('articleForm.actions.create.submit')
            "
            :loading="isLoading"
            :disabled="isLoading || !isValid"
            :icon="isEditing ? 'i-lucide-save' : 'i-lucide-plus'"
            @click="formRef?.submit()"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const { t } = useI18n()
const { user } = useUserSession()
const { success, error } = useNotifications()
const localePath = useLocalePath()

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

const { state, schema, setState, resetState, isValid } = usePostForm()

const formRef = useTemplateRef('formRef')
const isLoading = ref(false)

const isEditing = computed(() => props.mode === 'edit' || !!props.post)

// Handle button click with authentication check
const handleButtonClick = async () => {
  if (!user.value) {
    // Redirect to login if not authenticated
    await navigateTo(localePath('/auth/login'))
    return
  }
  // Open modal if authenticated
  open.value = true
}

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
  if (length > 500) return t('articleForm.badgeLabels.length.long')
  if (length > 200) return t('articleForm.badgeLabels.length.medium')
  return t('articleForm.badgeLabels.length.short')
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
  async (isOpen) => {
    if (isOpen) {
      // Check authentication when modal opens
      if (!user.value) {
        // Close modal and redirect to login
        open.value = false
        await navigateTo(localePath('/auth/login'))
        return
      }

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

const handleSubmit = async (event: FormSubmitEvent<PostFormState>) => {
  if (isEditing.value && !props.post) return

  isLoading.value = true
  try {
    if (isEditing.value) {
      await $fetch<ApiResponse<Post>>(`/api/posts/${props.post!.id}`, {
        method: 'PUT',
        body: event.data
      })
      success({
        title: t('articleForm.actions.edit.success.title'),
        message: t('articleForm.actions.edit.success.message')
      })
    } else {
      await $fetch<ApiResponse<Post>>('/api/posts', {
        method: 'POST',
        body: event.data
      })
      success({
        title: t('articleForm.actions.create.success.title'),
        message: t('articleForm.actions.create.success.message')
      })
      resetState()
    }
    emit('close', { success: true })
    open.value = false
  } catch {
    const errorTitle = isEditing.value
      ? t('articleForm.actions.edit.error.title')
      : t('articleForm.actions.create.error.title')
    const errorMessage = isEditing.value
      ? t('articleForm.actions.edit.error.message')
      : t('articleForm.actions.create.error.message')

    error({
      title: errorTitle,
      message: errorMessage
    })
  } finally {
    isLoading.value = false
  }
}
</script>
