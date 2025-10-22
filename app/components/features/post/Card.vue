<template>
  <UCard
    :class="[
      'group bg-white dark:bg-neutral-900 hover:shadow-lg transition-all duration-300 hover:ring-primary-200/60 dark:hover:ring-primary-700/60 hover:-translate-y-1 border-0 shadow-sm',
      viewMode === 'list' ? 'ring-1 ring-primary-200/30 dark:ring-primary-700/30' : ''
    ]"
  >
    <div class="space-y-6">
      <div class="flex justify-between items-start gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-2 h-2 bg-primary-500 rounded-full" />
            <span
              class="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider bg-primary-100 dark:bg-primary-900 px-2 py-1 rounded-full"
            >
              {{ t('articles.list.type') }}
            </span>
          </div>
          <h3
            class="text-xl font-bold text-neutral-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300 leading-tight group-hover:scale-105 origin-left"
          >
            {{ post.title }}
          </h3>
        </div>
        <UDropdownMenu v-if="isOwner" :items="dropdownItems">
          <UButton
            variant="ghost"
            color="secondary"
            icon="i-lucide-more-vertical"
            size="sm"
            square
            class="opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-secondary-100 dark:hover:bg-secondary-900/50"
          />
        </UDropdownMenu>
      </div>

      <div class="relative">
        <p
          :class="[
            'text-neutral-600 dark:text-neutral-300 leading-relaxed text-base',
            displayMode === 'compact' ? 'line-clamp-3' : ''
          ]"
        >
          {{ post.content }}
        </p>
        <div
          v-if="displayMode === 'compact'"
          class="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none"
        />
      </div>

      <div
        class="flex items-center justify-between pt-4 border-t border-primary-200/30 dark:border-primary-700/30"
      >
        <div
          :class="viewMode === 'grid' ? 'flex flex-col gap-2' : 'flex items-center gap-4'"
          class="text-sm text-neutral-500 dark:text-neutral-400"
        >
          <div
            class="flex items-center gap-2 transition-colors duration-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <UIcon name="i-lucide-user" class="w-4 h-4" />
            <span>{{ post.author?.name || 'Auteur inconnu' }}</span>
          </div>
          <div
            class="flex items-center gap-2 transition-colors duration-300 hover:text-secondary-600 dark:hover:text-secondary-400"
          >
            <UIcon name="i-lucide-calendar" class="w-4 h-4" />
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
          <div
            v-if="post.updatedAt !== post.createdAt"
            class="flex items-center gap-2 transition-colors duration-300 hover:text-secondary-600 dark:hover:text-secondary-400"
          >
            <UIcon name="i-lucide-pencil" class="w-4 h-4" />
            <span>{{ formatDate(post.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { FeaturesPostCreateModal, FeaturesPostDeleteModal } from '#components'

const { t } = useI18n()
const { user } = useUserSession()

interface Props {
  post: PostWithAuthor
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
      label: t('global.actions.edit'),
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
      label: t('global.actions.delete'),
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
</script>
