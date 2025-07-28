<template>
  <UFormField :label="label" :name="name" :required="required">
    <UInput
      :value="modelValue"
      :type="type"
      :placeholder="placeholder || t(`form.post.${name}.placeholder`)"
      color="primary"
      variant="outline"
      class="w-full"
      size="xl"
      @input="$emit('update:modelValue', $event.target.value)"
    >
      <template v-if="$slots.leading" #leading>
        <slot name="leading" />
      </template>
      <template v-if="$slots.trailing" #trailing>
        <slot name="trailing" />
      </template>
    </UInput>

    <template #error="{ error }">
      <span class="text-red-400 text-sm">{{ error }}</span>
    </template>
  </UFormField>
</template>

<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  modelValue?: string
  label: string
  name: string
  placeholder?: string
  required?: boolean
  type?: string
  admin?: boolean
}>()

defineEmits<(e: 'update:modelValue', value: string) => void>()
</script>
