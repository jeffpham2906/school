<template>
  <label
    :class="`text-sm block font-medium text-gray-700 dark:text-gray-200 ${required && `after:content-[' * '] after:ms-0.5 after:text-red-500 dark:after:text-red-400`}`"
  >
    {{ label || 'Label' }}
  </label>
</template>

<script setup lang="ts">
defineProps<{
  required?: boolean
  label: string
}>()
</script>
