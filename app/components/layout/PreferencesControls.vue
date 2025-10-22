<template>
  <UPageCard
    class="shadow-sm border-0 bg-white dark:bg-neutral-900 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div
          class="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center"
        >
          <UIcon name="i-lucide-settings" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
            {{ t('preferences.displayMode.label') }}
          </h3>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ t('preferences.current') }}
          </p>
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <div class="space-y-3">
        <label
          class="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
        >
          <UIcon name="i-lucide-layout-grid" class="w-4 h-4" />
          {{ t('preferences.displayMode.label') }}
        </label>
        <UFieldGroup class="w-full shadow-sm rounded-lg overflow-hidden">
          <UButton
            :variant="postViewMode === 'list' ? 'solid' : 'outline'"
            :color="postViewMode === 'list' ? 'primary' : 'secondary'"
            icon="i-lucide-list"
            size="sm"
            class="flex-1 justify-center transition-all duration-200 hover:scale-105"
            @click="setPostViewMode('list')"
          >
            {{ t('preferences.displayMode.list') }}
          </UButton>
          <UButton
            :variant="postViewMode === 'grid' ? 'solid' : 'outline'"
            :color="postViewMode === 'grid' ? 'primary' : 'secondary'"
            icon="i-lucide-layout-grid"
            size="sm"
            class="flex-1 justify-center transition-all duration-200 hover:scale-105"
            @click="setPostViewMode('grid')"
          >
            {{ t('preferences.displayMode.grid') }}
          </UButton>
        </UFieldGroup>
      </div>

      <div class="space-y-3">
        <label
          class="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
        >
          <UIcon name="i-lucide-eye" class="w-4 h-4" />
          {{ t('preferences.detailLevel.label') }}
        </label>
        <UFieldGroup class="w-full shadow-sm rounded-lg overflow-hidden">
          <UButton
            :variant="postDisplayMode === 'compact' ? 'solid' : 'outline'"
            :color="postDisplayMode === 'compact' ? 'primary' : 'secondary'"
            icon="i-lucide-minus"
            size="sm"
            class="flex-1 justify-center transition-all duration-200 hover:scale-105"
            @click="setPostDisplayMode('compact')"
          >
            {{ t('preferences.detailLevel.compact') }}
          </UButton>
          <UButton
            :variant="postDisplayMode === 'extended' ? 'solid' : 'outline'"
            :color="postDisplayMode === 'extended' ? 'primary' : 'secondary'"
            icon="i-lucide-plus"
            size="sm"
            class="flex-1 justify-center transition-all duration-200 hover:scale-105"
            @click="setPostDisplayMode('extended')"
          >
            {{ t('preferences.detailLevel.extended') }}
          </UButton>
        </UFieldGroup>
      </div>

      <div class="pt-4 border-t border-secondary-200/60 dark:border-secondary-700/60">
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="text-neutral-500 dark:text-neutral-400">{{
              t('preferences.current')
            }}</span>
            <UButton
              variant="ghost"
              color="secondary"
              icon="i-lucide-rotate-cw"
              size="xs"
              class="transition-all duration-200 hover:scale-105"
              @click="resetPreferences"
            >
              {{ t('global.actions.reset') }}
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
  </UPageCard>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { postViewMode, postDisplayMode, setPostViewMode, setPostDisplayMode, resetPreferences } =
  usePreferences()
</script>
