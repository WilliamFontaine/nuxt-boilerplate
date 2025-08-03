<template>
  <UCard :class="cardClass">
    <div class="space-y-6">
      <div class="flex justify-between items-start gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-2 h-2 bg-primary-500 rounded-full" />
            <span
              class="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider"
            >
              {{ t('posts.type') }}
            </span>
          </div>
          <h3
            class="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight"
          >
            {{ post.title }}
          </h3>
        </div>
        <UDropdownMenu v-if="isOwner" :items="dropdownItems">
          <UButton
            variant="ghost"
            icon="i-lucide-more-vertical"
            size="sm"
            square
            class="opacity-60 hover:opacity-100 transition-opacity"
          />
        </UDropdownMenu>
      </div>

      <div class="relative">
        <p
          :class="[
            'text-gray-600 dark:text-gray-300 leading-relaxed text-base',
            displayMode === 'compact' ? 'line-clamp-3' : ''
          ]"
        >
          {{ post.content }}
        </p>
        <div
          v-if="displayMode === 'compact'"
          class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none"
        />
      </div>

      <div
        class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800"
      >
        <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-calendar" class="w-4 h-4" />
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
          <div v-if="post.updatedAt !== post.createdAt" class="flex items-center gap-2">
            <UIcon name="i-lucide-pencil" class="w-4 h-4" />
            <span>{{ formatDate(post.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import FeaturesPostCreateModal from '~/components/features/post/CreateModal.vue'
import FeaturesPostDeleteModal from '~/components/features/post/DeleteModal.vue'

const { t } = useI18n()
const { user } = useUserSession()

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

const isOwner = computed(() => {
  return user.value && props.post.authorId === user.value.id
})

const overlay = useOverlay()
const editModal = overlay.create(FeaturesPostCreateModal)
const deleteModal = overlay.create(FeaturesPostDeleteModal)

const dropdownItems = [
  [
    {
      label: t('actions.edit'),
      icon: 'i-lucide-pencil',
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
      icon: 'i-lucide-trash-2',
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
