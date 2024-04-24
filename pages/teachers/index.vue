<template>
  <UCard
    :ui="{
      base: 'flex flex-col',
      ring: '',
      shadow: '',
      divide: '',
      header: { padding: 'pb-0' },
      body: { base: 'flex-1 flex flex-col gap-1' },
      footer: { base: 'flex items-center justify-between' },
    }"
  >
    <template #header>
      <HeaderPage>{{ $t('listTeachers') }}</HeaderPage>
    </template>

    <PopupConfirm
      v-if="isDeletePopupOpen"
      v-model="isDeletePopupOpen"
      @on-accept="handleDeleteTeacher(rowsSelected[0])"
      @on-refuse="rowsSelected = []"
      :message="`${$t('confirm_delete')} ${$t('teacher')} ${rowsSelected[0]?.name}`"
    />
    <ModalTeacher
      v-if="isDetailSceenOpen"
      v-model="isDetailSceenOpen"
      @call-refresh="refresh"
    />

    <div class="flex items-center justify-between px-4 py-1.5">
      <SeachBar v-model="search" />
      <div class="flex gap-2">
        <UDropdown
          :items="bulkOptions"
          :ui="{ width: 'w-32', padding: '', item: { active: '' } }"
        >
          <UButton
            :label="$t('bulk_button')"
            icon="i-heroicons-circle-stack"
            variant="ghost"
          />
          <template #item="{ item }">
            <UButton
              class="w-full"
              icon="i-heroicons-trash"
              trailing
              variant="soft"
              color="teal"
            >
              {{ $t(item.label) }}
            </UButton>
          </template>
        </UDropdown>
        <UButton
          :label="$t('add')"
          icon="i-heroicons-plus"
          :trailing="true"
          @click="handleOpenCreate"
        />
      </div>
    </div>
    <div class="flex justify-between px-4">
      <FilterDropView
        :items="filterStore.allFilters"
        v-model:selectedFilters="filterStore.selectedFilters"
        v-model:listFilterSaved="filterStore.listFilterSaved"
        v-model:filter-actived-name="filterStore.filterActived"
        @apply-filter="filterStore.applyFilters"
        @create-filter-mode="filterStore.createFilterMode"
        @delete-filter-mode="filterStore.deleteFilterMode"
      >
        <UButton icon="i-heroicons-funnel" size="xs" variant="soft">
          {{ $t('filter') }}
        </UButton>
      </FilterDropView>
      <DropColumnView
        :all-fields="fieldStore.allFields"
        :view-mode-options="fieldStore.viewModeOptions"
        v-model:viewMode="fieldStore.viewModeSelected"
        v-model:selectedFields="fieldStore.selectedFields"
        @create-view-mode="(e) => fieldStore.createViewMode(e)"
        @delete-view-mode="(e) => fieldStore.deleteViewMode(e)"
        @update-view-mode="
          (staleLabel, data) => fieldStore.updateViewMode(staleLabel, data)
        "
      >
        <UButton icon="i-heroicons-view-columns" size="xs" variant="soft">
          {{ $t('manage_columns') }}
        </UButton>
      </DropColumnView>
    </div>

    <UTable
      v-model="rowsSelected"
      v-model:sort="sort"
      :columns="columnsTable"
      :rows="dataTable"
      :loading="pending"
      sort-mode="manual"
      class="mt-1"
    >
      <template
        v-for="field in columnsTable"
        #[`${field.key}-header`]="{ column, onSort }"
        :key="field.key"
      >
        <div v-if="field.sortable">
          <ColumnNameSort
            :column="column"
            :sort="sort"
            @on-click="onSort(column)"
          />
        </div>
        <span v-else>
          {{ $t(column.label) }}
        </span>
      </template>

      <template
        v-for="field in columnsTable"
        #[`${field.key}-data`]="{ row: teacher }"
        :key="`${field.key}-data`"
      >
        <div v-if="['gender', 'type', 'status'].includes(field.key)">
          <div v-if="field.key === 'status'">
            <UBadge
              :label="`${$t(teacher.status)}`"
              :color="teacher.status === 'active' ? 'primary' : 'purple'"
              size="xs"
              variant="soft"
            />
          </div>
          <div v-else>{{ $t(teacher[field.key]) }}</div>
        </div>
        <div
          v-else-if="['name', 'teacherCode'].includes(field.key)"
          class="hover:opacity-50 cursor-pointer"
          @click="handleOpenDetail(teacher.id)"
        >
          <div v-if="field.key === 'name'" class="flex items-center gap-2">
            <UAvatar :src="teacher?.avatar?.url" icon="i-heroicons-user" />
            <span>{{ teacher[field.key] }}</span>
          </div>
          <span v-else>{{ teacher[field.key] }}</span>
        </div>
        <div v-else-if="['createdAt', 'updatedAt'].includes(field.key)">
          {{ VietnamTime.getVNTime(teacher[field.key]) }}
        </div>
        <div v-else-if="field.key === 'createdBy'">
          {{ teacher[field.key]?.name || '...' }}
        </div>
        <div v-else-if="field.key === 'actions'" class="flex gap-0.5">
          <UButton
            @click="handleOpenDetail(teacher.id)"
            icon="i-heroicons-eye"
            variant="ghost"
            size="xs"
          />
          <UButton
            @click="handleOpenDetail(teacher.id, true)"
            icon="i-heroicons-pencil-square"
            variant="ghost"
            size="xs"
          />
          <UButton
            @click="handleOpenDeletePopup(teacher)"
            icon="i-heroicons-trash"
            variant="ghost"
            size="xs"
          />
        </div>
        <div v-else>{{ teacher[field.key] }}</div>
      </template>
    </UTable>

    <template #footer>
      <div class="flex items-center gap-2">
        <UPagination
          v-model="page"
          :page-count="limit"
          :max="5"
          :total="total"
          size="xs"
        />
        <span class="text-sm">
          <span v-show="!!total">
            {{
              `${$t('show_from')} ${pageFrom} ${$t('to')} ${pageTo} ${$t('on')}`
            }}
          </span>
          <span>
            {{ ` ${total} ${$t('results')}` }}
          </span>
        </span>
      </div>
      <span class="flex items-center gap-1.5 text-sm">
        {{ $t('rows_per_page') }}
        <USelectMenu v-model="limit" :options="[10, 20, 50]" size="xs" />
      </span>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { deleteTeacher } from '~/services/teachers'
const fieldStore = useField()
const filterStore = useFilter()
const columnsTable = computed(() =>
  fieldStore.allFields.filter((field) =>
    fieldStore.selectedFields.some(
      (selected: Column) => selected.key === field.key
    )
  )
)

const bulkOptions = [
  [
    {
      label: 'delete',
      click: () => console.log('delete'),
      icon: 'i-heroicons-trash',
    },
  ],
]
const route = useRoute()

const isDetailSceenOpen = ref(false)
const handleOpenDetail = (id: string, andChange: boolean = false) => {
  if (id) {
    route.params.id = id
    if (andChange) {
      route.params.method = Action.Change
    } else {
      route.params.method = Action.Detail
    }
    isDetailSceenOpen.value = true
  }
}
const handleOpenCreate = () => {
  route.params.method = Action.Create
  isDetailSceenOpen.value = true
}

const rowsSelected = ref<Teacher[]>([])
const isDeletePopupOpen = ref(false)
const handleOpenDeletePopup = (teacher: Teacher) => {
  isDeletePopupOpen.value = true
  rowsSelected.value = [teacher]
}
const handleDeleteTeacher = async (teacher: Teacher) => {
  if (teacher.id) {
    await deleteTeacher(teacher.id)
    rowsSelected.value = []
    await refresh()
    isDeletePopupOpen.value = false
  }
}
// Pagination
const search = ref(route.query.search || '')

const page = ref(Number(route.query.page) || 1)
const limit = ref(Number(route.query.limit) || 10)

const sort = ref<Sort>({ column: 'createdAt', direction: 'desc' })

const dataTable = computed<Teacher[]>(() => data.value?.data.items || [])
const total = computed(() => data.value?.data.total ?? 0)
const pageFrom = computed(
  () => ((data.value?.data.page ?? 1) - 1) * (data.value?.data.limit ?? 10) + 1
)
const pageTo = computed(() =>
  Math.min(
    (data.value?.data.page ?? 1) * (data.value?.data.limit ?? 10),
    total.value
  )
)
const queries = computed(() => filterStore.query)

// Fetch Data
const { data, refresh, pending } = await useAPI<Data<GetData<Teacher>, Error>>(
  () => '/teachers' + `?${queries.value}`,
  {
    pick: ['data'],
    watch: [page, limit, search, queries, sort],
    lazy: true,
  }
)
</script>

<style>
em {
  color: #f87171;
  font-style: normal;
}
</style>
