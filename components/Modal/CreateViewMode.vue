<template>
  <UModal v-model="isCreateViewModeOpen">
    <UCard
      :ui="{
        footer: {
          base: 'flex flex-row-reverse gap-2',
        },
      }"
    >
      <template #header>
        <span v-if="!isEdit">{{ $t('create_view_mode_field') }}</span>
        <span v-else>{{ $t('update_view_mode_field') }}</span>
      </template>
      <UForm
        ref="formCreateViewMode"
        :state="viewModeState"
        :validate="validate"
        @error="onError"
        @submit="onSubmit"
      >
        <UFormGroup :label="$t('view_mode_name')" name="label">
          <template #default="{ error }">
            <UInput
              v-model="viewModeState.label"
              :trailing-icon="
                error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined
              "
            />
          </template>
          <template #error="{ error }">
            <span>{{ error && $t(error) }}</span>
          </template>
        </UFormGroup>
        <UDivider class="my-6" />
        <ULabel :label="$t('fields')" />
        <div class="flex flex-wrap gap-5 mt-6">
          <UCheckbox
            v-for="field in allFields"
            :key="field.key"
            :label="$t(field.label)"
            :model-value="
              viewModeState.fields.some((sf) => sf.key === field.key)
            "
            @change="handleChangeCheckBox(field)"
          />
        </div>
      </UForm>
      <template #footer>
        <UButton @click="formCreateViewMode.submit()">
          <span v-if="!isEdit">
            {{ $t('create') }}
          </span>
          <span v-else>
            {{ $t('update') }}
          </span>
        </UButton>
        <UButton @click="isCreateViewModeOpen = false" variant="ghost">
          {{ $t('cancel') }}
        </UButton>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'

defineProps<{
  allFields: Column[]
}>()
const emit = defineEmits<{
  createViewMode: [data: ViewMode]
  updateViewMode: [staleLabel: string, data: ViewMode]
}>()
interface State {
  label: string
  fields: Column[]
}
let initState: State = {
  label: '',
  fields: [],
}
const toast = useToast()
const viewModeState = ref<State>(initState)
const isCreateViewModeOpen = defineModel('isCreateViewModeOpen', {
  type: Boolean,
})
const selectedViewModeToEdit = defineModel<ViewMode>('selectedViewModeToEdit')
const isEdit = computed(() => !!selectedViewModeToEdit.value)
onMounted(() => {
  if (selectedViewModeToEdit.value) {
    const newState: State = {
      label: selectedViewModeToEdit.value.label,
      fields: selectedViewModeToEdit.value.fields,
    }
    viewModeState.value = { ...newState }
    initState = { ...newState }
  }
})
onUnmounted(() => {
  selectedViewModeToEdit.value = undefined
})
const formCreateViewMode = ref()

const handleChangeCheckBox = (field: Column) => {
  const index = viewModeState.value.fields.findIndex(
    (item) => item.key === field.key
  )
  if (index === -1) {
    viewModeState.value.fields.push(field)
  } else {
    viewModeState.value.fields.splice(index, 1)
  }
}
const validate = (): FormError[] => {
  const errors = []
  if (!viewModeState.value.label) {
    errors.push({ path: 'label', message: 'label_required' })
  }
  return errors
}
const onSubmit = (event: FormSubmitEvent<ViewMode>) => {
  if (event.data.fields.length < 2) {
    return toast.add({
      title: 'At least 2 field be selected',
      icon: 'i-heroicons-exclamation-triangle-20-solid',
      timeout: 2500,
      color: 'red',
    })
  }
  if (!isEdit.value) {
    return emit('createViewMode', event.data)
  }
  emit('updateViewMode', initState.label, event.data)
}
const onError = (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
