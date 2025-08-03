<template>
  <UiFormInput
    v-bind="$props"
    :type="showPassword ? 'text' : 'password'"
    class="w-full"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #leading>
      <UIcon name="i-lucide:lock" class="size-6" />
    </template>

    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="lg"
        :icon="showPassword ? 'i-lucide:eye-off' : 'i-lucide:eye'"
        :aria-pressed="showPassword"
        @click="showPassword = !showPassword"
      />
    </template>
  </UiFormInput>
</template>

<script setup lang="ts">
const showPassword = ref(false)

interface PasswordProps {
  modelValue: string
  label: string
  name: string
  placeholder?: string
  required?: boolean
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
}

defineProps<PasswordProps>()

defineEmits<(e: 'update:modelValue', value: string) => void>()
</script>
