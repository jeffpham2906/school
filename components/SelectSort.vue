<template>
  <USelect :options="options" v-model="sortSelected" />
</template>

<script setup lang="ts">
interface SortOption {
  label: string
  value: string
}
const props = defineProps<{
  options: SortOption[]
}>()
const route = useRoute()
const router = useRouter()
const sortSelected = ref(props.options[0].value)
watch(sortSelected, (newSort, oldSort) => {
  const nkey = newSort.split('=')[0]
  const nvalue = newSort.split('=')[1]

  const routeObj = new Map()
  routeObj.set(nkey, nvalue)
  if (newSort === '') {
    const oldKey = oldSort.split('=')[0]
    routeObj.delete(oldKey)
  }

  router.push({ path: route.fullPath, query: Object.fromEntries(routeObj) })
})
</script>
