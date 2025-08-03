<template>
  <UFormField :label="label" :name="name" :required="required">
    <UTextarea
      :model-value="modelValue"
      color="primary"
      variant="outline"
      class="w-full"
      size="xl"
      :rows="rows"
      :placeholder="placeholder"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <template #error="{ error }">
      <span class="text-red-400 text-sm">{{ error }}</span>
    </template>
  </UFormField>
</template>

<script setup lang="ts">
interface TextareaProps {
  modelValue?: string
  label: string
  name: string
  required?: boolean
  rows?: number
  placeholder?: string
}

defineProps<TextareaProps>()

defineEmits<(e: 'update:modelValue', value: string) => void>()
</script>
