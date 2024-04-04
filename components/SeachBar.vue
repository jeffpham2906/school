<template>
  <UInput
    :value="searchQuery"
    icon="i-heroicons-magnifying-glass-20-solid"
    :placeholder="`${$t('search_by_name/id')}`"
    class="w-72"
    @input="update"
  />
</template>

<script setup lang="ts">
const searchQuery = defineModel()
const { setRoute } = useQuery()
watch(searchQuery, () => {
  const q = stringToSlug(String(searchQuery.value))
  setRoute({ search: q }, '')
})
const update = debounce((e: Event) => {
  const q = (e.target as HTMLInputElement).value
  searchQuery.value = q
}, 660)
</script>
