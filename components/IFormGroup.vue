<template>
  <div class="grid grid-cols-2 items-center gap-2">
    <ULabel :label="label" />
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>
