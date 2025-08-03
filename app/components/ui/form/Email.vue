<template>
  <UiFormInput
    v-bind="$props"
    type="email"
    class="w-full"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #leading>
      <UIcon name="i-lucide:mail" class="size-6" />
    </template>
  </UiFormInput>
</template>

<script setup lang="ts">
interface EmailProps {
  modelValue: string
  label: string
  name: string
  placeholder?: string
  required?: boolean
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
}

defineProps<EmailProps>()

defineEmits<(e: 'update:modelValue', value: string) => void>()
</script>
