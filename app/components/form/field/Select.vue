<template>
  <UFormField :label="label" :name="name" :ui="{ label: 'text-white' }" :required="required">
    <USelectMenu
      :model-value="modelValue || null"
      :items="items"
      color="primary"
      variant="outline"
      :ui="{
        base: 'bg-neutral-800 text-white text-base',
        input: 'text-white placeholder-neutral-400',
        icon: 'text-neutral-400',
        option: 'text-white hover:bg-neutral-700',
        optionSelected: 'bg-neutral-700 text-white'
      }"
      class="w-full"
      size="xl"
      value-attribute="value"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template #default="{ modelValue: selectedValue }">
        <div v-if="selectedValue" class="flex items-center gap-2 h-6">
          {{ selectedValue.label }}
        </div>
        <span v-else class="text-neutral-400 h-6 text-base">
          {{ placeholder || t(`form.post.${name}.placeholder`) }}
        </span>
      </template>
      <template v-if="$slots.leading" #leading>
        <slot name="leading" />
      </template>
    </USelectMenu>
    <template #error="{ error }">
      <span class="text-red-400 text-sm">{{ error }}</span>
    </template>
  </UFormField>
</template>

<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  modelValue?: any
  label: string
  name: string
  items: any[]
  required?: boolean
  placeholder?: string
}>()

defineEmits<(e: 'update:modelValue', value: any) => void>()
</script>
