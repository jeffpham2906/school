<template>
  <div class="flex justify-between items-center gap-2">
    <ULabel :label="label" />
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>
