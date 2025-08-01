<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-lucide:moon' : 'i-lucide:sun'"
      color="neutral"
      variant="ghost"
      @click="toggleDark()"
    />
    <template #fallback>
      <UButton icon="i-lucide:sun" color="neutral" variant="ghost" disabled />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value: boolean) => (colorMode.value = value ? 'dark' : 'light')
})

const toggleDark = () => {
  isDark.value = !isDark.value
}
</script>
