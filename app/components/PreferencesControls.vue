<template>
  <UCard class="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
    <template #header>
      <div class="flex items-center gap-3">
        <div
          class="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center"
        >
          <UIcon name="i-lucide-settings" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('preferences.displayMode.label') }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('preferences.current') }}
          </p>
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <div class="space-y-3">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
          {{ t('preferences.displayMode.label') }}
        </label>
        <UButtonGroup class="w-full">
          <UButton
            :variant="postViewMode === 'list' ? 'solid' : 'outline'"
            icon="i-heroicons-list-bullet"
            size="sm"
            class="flex-1 justify-center"
            @click="setPostViewMode('list')"
          >
            {{ t('preferences.displayMode.list') }}
          </UButton>
          <UButton
            :variant="postViewMode === 'grid' ? 'solid' : 'outline'"
            icon="i-heroicons-squares-2x2"
            size="sm"
            class="flex-1 justify-center"
            @click="setPostViewMode('grid')"
          >
            {{ t('preferences.displayMode.grid') }}
          </UButton>
        </UButtonGroup>
      </div>

      <div class="space-y-3">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <UIcon name="i-heroicons-eye" class="w-4 h-4" />
          {{ t('preferences.detailLevel.label') }}
        </label>
        <UButtonGroup class="w-full">
          <UButton
            :variant="postDisplayMode === 'compact' ? 'solid' : 'outline'"
            icon="i-heroicons-minus"
            size="sm"
            class="flex-1 justify-center"
            @click="setPostDisplayMode('compact')"
          >
            {{ t('preferences.detailLevel.compact') }}
          </UButton>
          <UButton
            :variant="postDisplayMode === 'extended' ? 'solid' : 'outline'"
            icon="i-heroicons-plus"
            size="sm"
            class="flex-1 justify-center"
            @click="setPostDisplayMode('extended')"
          >
            {{ t('preferences.detailLevel.extended') }}
          </UButton>
        </UButtonGroup>
      </div>

      <div class="pt-4 border-t border-gray-100 dark:border-gray-800">
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-500 dark:text-gray-400">{{ t('preferences.current') }} :</span>
            <UButton
              variant="ghost"
              icon="i-heroicons-arrow-path"
              size="xs"
              @click="resetPreferences"
            >
              {{ t('actions.reset') }}
            </UButton>
          </div>
          <div class="flex flex-wrap gap-2">
            <UBadge
              :label="t(`preferences.displayMode.${postViewMode}`)"
              :color="postViewMode === 'grid' ? 'primary' : 'secondary'"
              variant="soft"
              size="sm"
            />
            <UBadge
              :label="t(`preferences.detailLevel.${postDisplayMode}`)"
              :color="postDisplayMode === 'extended' ? 'primary' : 'secondary'"
              variant="soft"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { postViewMode, postDisplayMode, setPostViewMode, setPostDisplayMode, resetPreferences } =
  usePreferences()
</script>
