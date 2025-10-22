<template>
  <UFormField :label="label" :name="name" :required="required">
    <UInput
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      color="primary"
      variant="outline"
      class="w-full"
      :size="size || 'xl'"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template v-if="$slots.leading" #leading>
        <slot name="leading" />
      </template>
      <template v-if="$slots.trailing" #trailing>
        <slot name="trailing" />
      </template>
    </UInput>

    <template #error="{ error }">
      <span class="text-error-400 text-sm">{{ error }}</span>
    </template>
  </UFormField>
</template>

<script setup lang="ts">
interface InputProps {
  modelValue?: string
  label: string
  name: string
  placeholder?: string
  required?: boolean
  type?: string
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
  admin?: boolean
}

defineProps<InputProps>()

defineEmits<(e: 'update:modelValue', value: string) => void>()
</script>
