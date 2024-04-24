<template>
  <UPopover :popper="{ placement: 'right-end' }">
    <slot />
    <template #panel>
      <div class="px-3 py-3 text-sm space-y-2">
        <UTabs :items="tabs">
          <template #default="{ item }"> {{ $t(item.label) }}</template>
          <template #item="{ item }">
            <UCard
              v-if="item.label === 'filter'"
              :ui="{
                footer: {
                  base: 'flex justify-around',
                },
              }"
            >
              <FilterItem
                v-for="(item, index) in items"
                :isLastItem="index === items.length - 1"
                :key="item.label"
                :label="item.label"
                :options="item.options"
                :auto-show="item.autoShow"
                v-model="selectedFilters[item.label as keyof SelectedFilters]"
              />

              <template #footer>
                <UButton size="xs" variant="ghost" @click="onClearFilter">
                  {{ $t('clear ') }}
                </UButton>
                <UButton size="xs" @click="emit('applyFilter', 'default')">
                  {{ $t('apply ') }}
                </UButton>
              </template>
            </UCard>
            <FilterSavedScreen
              v-else
              v-model:list-filter-saved="listFilterSaved"
              v-model:filter-actived-name="filterActivedName"
              :all-filters="items"
              @create-filter-mode="(e) => emit('createFilterMode', e)"
              @delete-filter-mode="(e) => emit('deleteFilterMode', e)"
              @apply-filter="(e) => emit('applyFilter', e)"
              @clear-filter-mode="handleClearFilterMode"
            />
          </template>
        </UTabs>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
defineProps<{
  items: Filter[]
}>()
const selectedFilters = defineModel<SelectedFilters>('selectedFilters', {
  default: {
    gender: [],
    type: [],
    status: [],
  },
  required: true,
})
const listFilterSaved = defineModel<FilterMode[]>('listFilterSaved', {
  default: [],
  required: true,
})
const filterActivedName = defineModel<string>('filterActivedName', {
  required: true,
  default: 'default',
})
const emit = defineEmits<{
  applyFilter: [filterMode: string]
  createFilterMode: [filterMode: FilterMode]
  deleteFilterMode: [nameFilterMode: string]
}>()
const tabs = [{ label: 'filter' }, { label: 'list_save_filters' }]
const onClearFilter = () => {
  selectedFilters.value.gender = []
  selectedFilters.value.type = []
  selectedFilters.value.status = []
}
const handleClearFilterMode = () => {
  filterActivedName.value = 'default'
  onClearFilter()
}
</script>
