<template>
  <UCard :ui="ui">
    <template #header>
      <slot name="header" />
    </template>
    <slot />
    <template #footer>
      <slot class="" name="footer" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: string
}>()

const ui = computed(() => {
  if (props.size === 'sm') {
    return {
      header: {
        base: 'text-sm flex gap-4 items-center',
        padding: 'px-6 py-3 sm:px-6 sm:py-3',
      },
      body: {
        base: 'text-sm flex flex-col gap-1 max-h-96 overflow-auto',
        padding: 'px-6 py-3 sm:px-6 sm:py-3',
      },
      footer: {
        base: 'text-sm ',
        padding: 'px-6 py-3 sm:px-6 sm:py-3',
      },
    }
  }
})
</script>
