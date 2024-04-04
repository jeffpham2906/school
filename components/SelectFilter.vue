<template>
  <ISelect
    v-model="labelSelected"
    :fallback-label="options[0]"
    :options="options"
    multiple
    :placeholder="$t(`${labelFilter}`)"
  >
    <template #labelValue>
      <span>{{
        labelSelected.length > 0
          ? `${labelSelected.length} ${$t('selected')}`
          : $t(labelFilter)
      }}</span>
    </template>
  </ISelect>
</template>

<script setup lang="ts">
const props = defineProps<{
  options: string[]
  size?: string
  labelFilter: string
}>()

const route = useRoute()
const router = useRouter()

const initialValue = () => {
  if (Object.keys(route.query).some((e) => e.includes(props.labelFilter))) {
    return props.options
      .reduce((arr: string[], label, index) => {
        if (Object.values(route.query).includes(label)) {
          arr[index] = label
        }

        return arr
      }, [])
      .filter((e) => e)
  }
  return []
}

const labelSelected = ref(initialValue())

watch(labelSelected, () => {
  let key
  let oneKeyValue = ''
  const filterObj = props.options.reduce(
    (obj, gender, index) => {
      key = `filter[${props.labelFilter}][${index}]`
      oneKeyValue = `filter[${props.labelFilter}]`
      if (labelSelected.value.includes(gender)) {
        if (labelSelected.value.length <= 1) {
          obj[oneKeyValue] = gender
          delete obj[key]
        } else {
          obj[key] = gender
          delete obj[oneKeyValue]
        }
      } else {
        delete obj[key]
      }

      return obj
    },
    { ...route.query }
  )
  if (!labelSelected.value.length) {
    delete filterObj[oneKeyValue]
  }
  router.replace({ path: route.fullPath, query: filterObj })
})
</script>
