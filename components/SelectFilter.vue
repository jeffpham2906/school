<template>
  <USelect v-model="labelSelected" :options="options" :size="size" />
</template>

<script setup lang="ts">
import type { LocationQueryValue } from 'vue-router'

interface Options {
  label: string
  value: string | number
}
const props = defineProps<{
  options: Options[]
  size?: string
  labelFilter: string
}>()

const key = props.labelFilter

const route = useRoute()
const { setRoute } = useQuery()

const labelSelected = ref<Options | string | number | LocationQueryValue[]>(
  route.query[key] ?? props.options[0].value
)

watch(labelSelected, () => {
  const obj = new Map()
  obj.set(key, labelSelected.value)
  setRoute(Object.fromEntries(obj.entries()), '' + props.options[0].value)
})

watch(
  () => route.query[key],
  () => {
    if (route.query[key] === undefined) {
      labelSelected.value = String(props.options[0].value)
    }
  }
)
</script>
