<template>
  <ModalCreateFilterMode
    v-if="isCreateFilterModeOpen"
    v-model:is-create-filter-mode-open="isCreateFilterModeOpen"
    v-model:selected-filter-to-edit="selectedFilterToEdit"
    :all-filters="allFilters"
    @create-filter-mode="(e) => emit('createFilterMode', e)"
    @update-filter-mode="
      (data, staleValue) => emit('updateFilterMode', data, staleValue)
    "
  />
  <PopupConfirm
    v-model="isPopupConfirmOpen"
    :message="`${$t('confirm_delete')} ${$t('filter')} ${nameDeleted}`"
    @on-accept="
      () => {
        emit('deleteFilterMode', nameDeleted)
        isPopupConfirmOpen = false
      }
    "
    @on-refuse="nameDeleted = ''"
  />
  <UCard
    :ui="{
      header: {
        base: 'flex items-center justify-between',
      },
      footer: {
        base: 'flex justify-around',
      },
    }"
  >
    <template #header>
      <span>{{ $t('all') }}</span>
      <UButton
        variant="outline"
        icon="i-heroicons-plus"
        size="2xs"
        @click="isCreateFilterModeOpen = true"
      />
    </template>
    <span v-if="listFilterSaved.length < 1">{{ $t('emtpy') }}</span>
    <URadio
      v-else
      v-for="filterSaved in listFilterSaved"
      v-bind="filterSaved"
      :key="filterSaved.value"
      :ui="{
        label: 'grid grid-cols-[1fr,auto] items-center justify-between',
        inner: 'w-full',
        wrapper: 'items-center',
      }"
      :label="filterSaved.value"
      v-model="filterActivedName"
    >
      <template #label>
        <span class="max-w-28 break-words">{{ filterSaved.value }}</span>
        <div class="flex items-center">
          <UButton
            icon="i-heroicons-pencil-square"
            variant="ghost"
            size="2xs"
            @click="handleEditFilterSaved(filterSaved)"
          />
          <UButton
            icon="i-heroicons-trash"
            variant="ghost"
            size="2xs"
            @click="handleDeleteModalOpen(filterSaved.value)"
          />
        </div>
      </template>
    </URadio>
    <template #footer>
      <UButton size="xs" variant="ghost" @click="emit('clearFilterMode')">
        {{ $t('clear') }}
      </UButton>
      <UButton size="xs" @click="emit('applyFilter', filterActivedName)">
        {{ $t('apply') }}
      </UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  allFilters: Filter[]
}>()
const emit = defineEmits<{
  applyFilter: [filterMode: string]
  createFilterMode: [filterMode: FilterMode]
  updateFilterMode: [filterMode: FilterMode, staleValue: string]
  deleteFilterMode: [filterValue: string]
  clearFilterMode: []
}>()
const listFilterSaved = defineModel<FilterMode[]>('listFilterSaved', {
  default: [],
  required: true,
})
const filterActivedName = defineModel<string>('filterActivedName', {
  required: true,
  default: '',
})

const isCreateFilterModeOpen = ref(false)
const selectedFilterToEdit = ref<FilterMode | undefined>()
const handleEditFilterSaved = (filterMode: FilterMode) => {
  selectedFilterToEdit.value = filterMode
  isCreateFilterModeOpen.value = true
}
const nameDeleted = ref('')
const isPopupConfirmOpen = ref(false)
const handleDeleteModalOpen = (name: string) => {
  nameDeleted.value = name
  isPopupConfirmOpen.value = true
}
</script>
