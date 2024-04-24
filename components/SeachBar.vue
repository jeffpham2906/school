<template>
  <UInput
    :value="searchQuery"
    icon="i-heroicons-magnifying-glass-20-solid"
    :placeholder="`${$t('search_by_name/id')}`"
    class="max-w-xs w-full"
    @input="update"
  />
</template>

<script setup lang="ts">
const searchQuery = defineModel()

const update = debounce((e: Event) => {
  const q = (e.target as HTMLInputElement).value
  searchQuery.value = q
}, 660)
</script>
