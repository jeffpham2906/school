<template>
  <USelect
    v-model="labelSelected"
    :options="labelOptions"
    :ui="{ base: 'capitalize' }"
    :size="size"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  labelOptions: string[] | number[]
  size?: string
  labelFilter?: string
}>()

const key = props.labelFilter || `filter[${props.labelOptions[0]}]`

const route = useRoute()
const { setRoute } = useQuery()
const labelSelected = ref(route.query[key] ?? props.labelOptions[0])

watch(labelSelected, () => {
  const obj = new Map()
  obj.set(key, labelSelected.value)

  setRoute(Object.fromEntries(obj.entries()), '' + props.labelOptions[0])
})

watch(
  () => route.query,
  () => {
    const newValue = route.query[key] ?? props.labelOptions[0]
    labelSelected.value = newValue
  }
)
</script>
