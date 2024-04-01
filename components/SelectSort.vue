<template>
  <USelect :options="options" v-model="sortSelected" />
</template>

<script setup lang="ts">
interface SortOption {
  label: string
  value?: object
}
const props = defineProps<{
  options: SortOption[]
}>()
// const route = useRoute()
// const { setRoute } = useQuery()
const sortSelected = ref(props.options[0])
watch(sortSelected, (newSort, oldSort) => {
  console.log('new', newSort.value)
  console.log('old', oldSort.value)
  //   const routeObj = new Map()
  //   routeObj.set(
  //     `sort[${sortSelected.value.labelSort}]`,
  //     sortSelected.value.value
  //   )
})
</script>
