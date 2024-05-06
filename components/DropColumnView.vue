<template>
  <UPopover :popper="{ placement: 'left-end' }">
    <slot />

    <template #panel>
      <ModalCreateViewMode
        v-if="isCreateViewModeOpen"
        v-model:isCreateViewModeOpen="isCreateViewModeOpen"
        v-model:selectedViewModeToEdit="selectedViewModeToEdit"
        :allFields="allFields"
        @create-view-mode="handleCreateViewMode"
        @update-view-mode="handleUpdateViewMode"
      />
      <MyCard size="sm">
        <template #header> {{ $t('listFields') }} </template>

        <div class="space-y-1">
          <div class="flex items-center justify-between mb-1">
            <span>{{ $t('View_mode') }}</span>
            <UButton
              size="2xs"
              icon="i-heroicons-plus"
              variant="outline"
              @click="isCreateViewModeOpen = true"
            />
          </div>
          <URadio
            v-for="option of viewModeOptions"
            :key="option.label"
            v-bind="option"
            v-model="viewMode"
            class="items-center"
            :ui="{
              label: 'grid grid-cols-[1fr,auto] items-center justify-between',
              inner: 'w-full',
            }"
          >
            <template #label>
              <span v-if="!option.isEdited"> {{ $t(option.label) }}</span>
              <span v-else>{{ option.label }}</span>
              <div v-if="option.isEdited" class="flex items-start">
                <UButton
                  @click="() => handleOpenEditViewMode(option)"
                  icon="i-heroicons-pencil-square"
                  variant="ghost"
                  size="2xs"
                />
                <PopupConfirm
                  v-model="deleteConfirmPopup"
                  @on-accept="emit('deleteViewMode', option.value)"
                >
                  <span>
                    {{ `${$t('confirm_delete')} ${$t('view_mode')} ` }}
                  </span>
                  <span class="text-[#f87171]">{{ option.label }}</span>
                  ?
                </PopupConfirm>
                <UButton
                  @click="() => (deleteConfirmPopup = true)"
                  icon="i-heroicons-trash"
                  variant="ghost"
                  size="2xs"
                />
              </div>
            </template>
          </URadio>
        </div>
        <UDivider class="my-1" />
        <div
          v-for="item in allFields"
          :key="`${item.key}`"
          class="grid grid-cols-[auto,1fr] gap-4 items-center space-y-0.5"
        >
          <UToggle
            size="xs"
            :model-value="selectedFields.some((sf) => sf.key === item.key)"
            @change="handleFieldSelected(item)"
            :disabled="!isEdited"
          />
          <ULabel :label="$t(item.label)" />
        </div>
        <template #footer>
          <div class="flex items-center justify-around">
            <UButton size="xs" variant="soft" @click="handleShowAll">
              {{ $t('show_all') }}
            </UButton>
            <UButton size="xs" variant="soft" @click="handleHideAll">
              {{ $t('hide_all') }}
            </UButton>
          </div>
        </template>
      </MyCard>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
const props = defineProps<{
  allFields: Column[]
  viewModeOptions: ViewMode[]
}>()
const emit = defineEmits<{
  createViewMode: [data: ViewMode]
  deleteViewMode: [value: string]
  updateViewMode: [staleLabel: string, data: ViewMode]
}>()

const deleteConfirmPopup = ref(false)
const selectedViewModeToEdit = ref<ViewMode | undefined>()
const handleOpenEditViewMode = (viewMode: ViewMode) => {
  selectedViewModeToEdit.value = viewMode
  isCreateViewModeOpen.value = true
}

const viewMode = defineModel<string>('viewMode', { required: true })
const isEdited = computed(() => viewMode.value === 'custom')
const selectedFields = defineModel<Column[]>('selectedFields', {
  default: [],
  required: true,
})

const isCreateViewModeOpen = ref(false)
const handleCreateViewMode = (data: ViewMode) => {
  emit('createViewMode', data)
  isCreateViewModeOpen.value = false
}
const handleUpdateViewMode = (staleLabel: string, data: ViewMode) => {
  emit('updateViewMode', staleLabel, data)
  isCreateViewModeOpen.value = false
}

const handleFieldSelected = (item: Column) => {
  const index = selectedFields.value.findIndex(
    (field) => field.key === item.key
  )
  if (index === -1) {
    selectedFields.value.push(item)
  } else {
    if (selectedFields.value.length <= 2) {
      return
    }
    selectedFields.value.splice(index, 1)
  }
}
const handleShowAll = async () => {
  selectedFields.value = [...props.allFields]
  console.log(selectedFields.value)
  viewMode.value = 'custom'
}
const handleHideAll = () => {
  viewMode.value = 'custom'
  selectedFields.value = [props.allFields[0], props.allFields[1]]
}
</script>
