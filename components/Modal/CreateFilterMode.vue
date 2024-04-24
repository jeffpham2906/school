<template>
  <UModal v-model="isCreateFilterModeOpen">
    <UCard
      :ui="{
        footer: {
          base: 'flex flex-row-reverse gap-2',
        },
      }"
    >
      <template #header>
        {{ $t('create_filter') }}
      </template>
      <UForm
        ref="filterModeForm"
        :state="filterModeState"
        :schema="filterModeStateRules"
        @submit="onSubmit"
        @error="onError"
      >
        <UFormGroup class="mb-4" :label="$t('filter_name')" name="name">
          <UInput v-model="filterModeState.name" />
        </UFormGroup>
        <div class="mb-4" v-for="filter in allFilters" :key="filter.label">
          <div class="mb-3">{{ $t(filter.label) }}</div>
          <div class="flex gap-4">
            <UCheckbox
              v-for="option in filter.options"
              :key="option"
              :label="$t(option)"
              :model-value="
                filterModeState.filterObj[
                  filter.label as keyof SelectedFilters
                ].includes(option)
              "
              @change="handleChangeFilterOption(filter.label, option)"
            />
          </div>
        </div>
      </UForm>
      <template #footer>
        <UButton @click="filterModeForm.submit()">{{ $t('create') }}</UButton>
        <UButton variant="ghost" @click="isCreateFilterModeOpen = false">
          {{ $t('cancel') }}
        </UButton>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
const isCreateFilterModeOpen = defineModel('isCreateFilterModeOpen')
defineProps<{
  allFilters: Filter[]
}>()
const emit = defineEmits<{
  createFilterMode: [filterMode: FilterMode]
}>()
const filterModeForm = ref()
const filterModeStateRules = yup.object({
  name: yup.string().required('Please enter a name filter mode'),
})
const filterModeState = ref<FilterMode>({
  name: '',
  filterObj: {
    gender: [],
    type: [],
    status: [],
  },
})
const handleChangeFilterOption = (filterKey: string, value: string) => {
  const filterObjKeyWithValue =
    filterModeState.value.filterObj[filterKey as keyof SelectedFilters]
  const index = filterObjKeyWithValue.findIndex((e) => e === value)
  if (index === -1) {
    filterObjKeyWithValue.push(value)
  } else {
    filterObjKeyWithValue.splice(index, 1)
  }
}
const toast = useToast()
const onSubmit = (event: FormSubmitEvent<FilterMode>) => {
  const filterObj = event.data.filterObj
  if (
    filterObj.gender.length < 1 &&
    filterObj.type.length < 1 &&
    filterObj.status.length < 1
  ) {
    return toast.add({
      title: 'Please choose at least one filter ',
      icon: 'i-heroicons-x-circle',
      timeout: 2500,
    })
  }
  emit('createFilterMode', event.data)
  isCreateFilterModeOpen.value = false
}
const onError = async (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
