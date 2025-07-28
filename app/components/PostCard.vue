<template>
  <UCard :class="cardClass">
    <template #header>
      <div class="flex justify-between gap-4">
        <div class="flex-1 min-w-0">
          <h3
            class="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
          >
            {{ post.title }}
          </h3>
        </div>
        <UDropdownMenu :items="dropdownItems">
          <UButton variant="ghost" icon="i-heroicons-ellipsis-vertical" size="sm" square />
        </UDropdownMenu>
      </div>
    </template>

    <div class="space-y-4">
      <p
        :class="[
          'text-gray-700 dark:text-gray-300 leading-relaxed',
          displayMode === 'compact' ? 'line-clamp-3' : ''
        ]"
      >
        {{ post.content }}
      </p>
    </div>

    <template v-if="displayMode === 'extended'" #footer>
      <div class="flex flex-col text-xs gap-y-1 text-gray-600 dark:text-gray-400">
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
          <span>
            {{
              t('postForm.fields.createdAt.label', {
                date: formatDate(post.createdAt),
                time: formatTime(post.createdAt)
              })
            }}
          </span>
        </div>
        <div v-if="post.updatedAt !== post.createdAt" class="flex items-center gap-1">
          <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
          <span>
            {{
              t('postForm.fields.updatedAt.label', {
                date: formatDate(post.updatedAt),
                time: formatTime(post.updatedAt)
              })
            }}
          </span>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import ModalPost from '~/components/modal/post/index.vue'
import ModalPostDelete from '~/components/modal/post/delete.vue'

const { t } = useI18n()

interface Props {
  post: Post
  displayMode?: 'compact' | 'extended'
  viewMode?: 'list' | 'grid'
}

const props = withDefaults(defineProps<Props>(), {
  displayMode: 'compact',
  viewMode: 'list'
})

const emit = defineEmits<{
  refresh: []
}>()

const overlay = useOverlay()
const editModal = overlay.create(ModalPost)
const deleteModal = overlay.create(ModalPostDelete)

const dropdownItems = [
  [
    {
      label: t('actions.edit'),
      icon: 'i-heroicons-pencil',
      async onSelect() {
        const result = await editModal.open({
          mode: 'edit',
          post: props.post,
          open: true
        }).result
        if (result?.success) emit('refresh')
      }
    }
  ],
  [
    {
      label: t('actions.delete'),
      icon: 'i-heroicons-trash',
      async onSelect() {
        const result = await deleteModal.open({
          post: props.post,
          open: true
        }).result
        if (result?.success) emit('refresh')
      }
    }
  ]
]

const cardClass = computed(() => [
  'group hover:shadow-lg transition-all duration-200',
  props.viewMode === 'list' ? 'ring-1 ring-gray-200 dark:ring-gray-800' : '',
  'hover:ring-primary-200 dark:hover:ring-primary-800'
])
</script>
