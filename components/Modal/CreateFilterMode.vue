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
        <span v-if="!isEdit"> {{ $t('create_filter') }}</span>
        <span v-else> {{ $t('update_filter') }}</span>
      </template>
      <UForm
        ref="filterModeForm"
        :state="filterModeState"
        :validate="validate"
        @submit="onSubmit"
        @error="onError"
      >
        <UFormGroup class="mb-4" :label="$t('filter_name')" name="value">
          <template #default="{ error }">
            <UInput
              v-model="filterModeState.value"
              :trailing-icon="
                error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined
              "
            />
          </template>
          <template #error="{ error }">
            <span>{{ error && $t(error) }}</span>
          </template>
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
        <UButton @click="filterModeForm.submit()">
          <span v-if="!isEdit">{{ $t('create') }}</span>
          <span v-else>{{ $t('update') }}</span>
        </UButton>
        <UButton variant="ghost" @click="isCreateFilterModeOpen = false">
          {{ $t('cancel') }}
        </UButton>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'
const isCreateFilterModeOpen = defineModel('isCreateFilterModeOpen')
const selectedFilterToEdit = defineModel<FilterMode>('selectedFilterToEdit')
defineProps<{
  allFilters: Filter[]
}>()

const emit = defineEmits<{
  createFilterMode: [filterMode: FilterMode]
  updateFilterMode: [filterMode: FilterMode, staleValue: string]
}>()
const filterModeForm = ref()

let initState: FilterMode = {
  value: '',
  filterObj: {
    gender: [],
    type: [],
    status: [],
  },
}
const filterModeState = ref<FilterMode>(initState)
onMounted(() => {
  if (selectedFilterToEdit.value) {
    filterModeState.value = { ...selectedFilterToEdit.value }
    initState = { ...selectedFilterToEdit.value }
  }
  console.log(initState)
})
onUnmounted(() => (selectedFilterToEdit.value = undefined))

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
const isEdit = computed(() => !!selectedFilterToEdit.value)
const validate = (): FormError[] => {
  const errors = []
  if (!filterModeState.value.value) {
    errors.push({ path: 'value', message: 'please_enter_a_name_filter_mode' })
  }
  return errors
}
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
      color: 'red',
    })
  }
  if (isEdit.value) {
    emit('updateFilterMode', event.data, initState.value)
  } else {
    emit('createFilterMode', event.data)
  }
  isCreateFilterModeOpen.value = false
}
const onError = async (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
