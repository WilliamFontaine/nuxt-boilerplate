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
    class="backdrop-blur-sm"
  >
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

          <div
            class="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                  <UIcon name="i-lucide-type" class="w-3 h-3" />
                  <span>{{
                    t('articleForm.analytics.characterCount', { count: state.content.length })
                  }}</span>
                </div>
                <UBadge
                  :label="getBadgeLabel()"
                  :color="getBadgeColor()"
                  variant="soft"
                  size="sm"
                />
              </div>
              <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                <UIcon name="i-lucide-book-open" class="w-3 h-3" />
                <span>{{ t('articleForm.analytics.wordCount', { count: wordCount }) }}</span>
              </div>
              <div
                v-if="readingTime > 0"
                class="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs"
              >
                <UIcon name="i-lucide-clock" class="w-3 h-3" />
                <span>{{ t('articleForm.analytics.readingTime', { count: readingTime }) }}</span>
              </div>
            </div>
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div
        class="flex flex-col w-full p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-info" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span class="text-xs text-gray-600 dark:text-gray-300 font-medium">
            {{
              isEditing
                ? t('articleForm.actions.edit.autoSaveInfo')
                : t('articleForm.actions.create.autoSaveInfo')
            }}
          </span>
        </div>
        <div class="flex gap-3 self-end">
          <UButton
            type="button"
            color="secondary"
            variant="outline"
            :label="
              isEditing
                ? t('articleForm.actions.edit.cancel')
                : t('articleForm.actions.create.cancel')
            "
            icon="i-lucide-x"
            :disabled="isLoading"
            class="transition-all duration-300 hover:scale-105"
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
            class="transition-all duration-300 hover:scale-105"
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
const { getErrorCode } = useApiError()
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

const handleSubmit = async (event: FormSubmitEvent<CreatePostData | UpdatePostData>) => {
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
  } catch (err: any) {
    const errorCode = getErrorCode(err)

    const errorTitle = isEditing.value
      ? t('articleForm.actions.edit.error.title')
      : t('articleForm.actions.create.error.title')

    switch (errorCode) {
      case ERROR_CODES.AUTH.UNAUTHORIZED:
        error({
          title: errorTitle,
          message: t('articleForm.error.unauthorized')
        })
        break

      case ERROR_CODES.VALIDATION.ERROR:
      case ERROR_CODES.VALIDATION.INVALID_INPUT:
        error({
          title: errorTitle,
          message: t('articleForm.error.validation')
        })
        break

      case ERROR_CODES.RESOURCE.NOT_FOUND:
        error({
          title: errorTitle,
          message: t('articleForm.error.notFound')
        })
        break

      default: {
        const errorMessage = isEditing.value
          ? t('articleForm.actions.edit.error.message')
          : t('articleForm.actions.create.error.message')
        error({
          title: errorTitle,
          message: errorMessage
        })
      }
    }
  } finally {
    isLoading.value = false
  }
}
</script>
