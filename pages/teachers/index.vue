<template>
  <UCard
    class="h-full relative"
    :ui="{
      base: '',
      ring: '',
      shadow: '',
      divide: '',
    }"
  >
    <PopUp v-model="isPopupOpen" @onLeftClick="handleDeleteTeacher">
      <template #message>
        {{ `${$t('confirm_delete')} ${$t('teacher')}` }}
      </template>
    </PopUp>
    <CreateTeacher v-model="isCreateFormOpen" :refresh-fc="refresh" />
    <DetailScreen
      v-if="isDetailSceenOpen"
      v-model="isDetailSceenOpen"
      :refresh-fc="refresh"
    />
    <template #header>
      <HeaderPage>{{ $t('listTeachers') }}</HeaderPage>
    </template>
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex gap-2">
        <SeachBar v-model="searchQuery" />
        <SelectFilter
          :options="['male', 'female', 'other']"
          label-filter="gender"
        />
        <SelectFilter
          :options="['official', 'contract', 'parttime']"
          label-filter="type"
          class="min-w-24"
        />
        <SelectFilter :options="['active', 'disabled']" label-filter="status" />
      </div>

      <UButton
        :label="$t('add')"
        icon="i-heroicons-plus"
        :trailing="true"
        @click="isCreateFormOpen = true"
      />
    </div>
    <UTable
      v-model="rowsSelected"
      :columns="columns"
      :rows="dataTable"
      :loading="pending"
      sort-asc-icon="i-heroicons-arrow-up"
      sort-desc-icon="i-heroicons-arrow-down"
      sort-mode="manual"
    >
      <template #teacherCode-header="{ column }">
        {{ $t(column.key) }}
      </template>
      <template #name-header>
        {{ $t('name') }}
      </template>
      <template #gender-header>
        {{ $t('gender') }}
      </template>
      <template #phone-header>
        {{ $t('phone') }}
      </template>
      <template #email-header> Email </template>
      <template #type-header>
        {{ $t('type') }}
      </template>
      <template #status-header>
        {{ $t('status') }}
      </template>
      <template #name-data="{ row }">
        <span v-if="row._highlight" v-html="row._highlight.name[0]" />
        <span v-else> {{ row.name }}</span>
      </template>
      <template #gender-data="{ row }">
        {{ $t(row.gender) }}
      </template>
      <template #type-data="{ row }">
        {{ $t(row.type) }}
      </template>
      <template #status-data="{ row }">
        <UBadge
          :label="`${$t(row.status)}`"
          variant="soft"
          :color="row.status === 'active' ? 'primary' : 'white'"
          size="xs"
        />
      </template>
      <template #actions-data="{ row }">
        <UDropdown
          :items="actionsData"
          :ui="{ width: 'w-36', item: { padding: 'py-0.5' }, padding: 'p-0' }"
          :popper="{ placement: 'right-start' }"
        >
          <UButton label="..." color="white" variant="ghost" />
          <template #item="{ item }">
            <span
              class="flex items-center gap-1.5 w-full"
              @click="handleActionClick(item.value, row.id)"
            >
              <UIcon :name="item.icon" />
              <UButton
                :label="$t(item.label)"
                color="black"
                variant="ghost"
                size="xs"
              />
            </span>
          </template>
        </UDropdown>
      </template>
    </UTable>
    <template #footer>
      <div
        class="absolute bottom-5 left-8 right-8 flex justify-between items-center"
      >
        <div class="flex items-center gap-2">
          <UPagination
            v-model="page"
            :page-count="1"
            :total="teacherData?.data.totalPages"
            :max="5"
            size="xs"
          />
          <span class="text-sm">
            <span v-show="!!teacherData?.data.total">
              {{
                `${$t('show_from')} ${pageFrom} ${$t('to')} ${pageTo} ${$t('on')}`
              }}
            </span>
            <span>
              {{ ` ${teacherData?.data.total ?? 0} ${$t('results')}` }}
            </span>
          </span>
        </div>
        <span class="flex items-center gap-1.5 text-sm">
          {{ $t('rows_per_page') }}
          <USelectMenu v-model="limit" :options="[10, 20, 50]" size="xs" />
        </span>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { deleteTeacher, getAllTeachers } from '~/services/teachers'

definePageMeta({
  layout: 'applayout',
})
const route = useRoute()
const router = useRouter()
const isCreateFormOpen = ref(false)
const isDetailSceenOpen = ref(false)
const deleteId = ref('')
const isPopupOpen = ref(false)
const rowsSelected = ref([])

// Fetch Data
const { data: teacherData, refresh, pending } = await getAllTeachers()
const searchQuery = computed({
  get: () => teacherData.value?.data.search ?? (route.query.search || ''),
  set: (newValue) => {
    if (teacherData.value) {
      teacherData.value.data.search = newValue
    }
    const queryObj = {
      ...route.query,
      search: newValue,
      page: 1,
    }
    // @ts-expect-error key
    if (!newValue) delete queryObj.search
    router.push({ query: queryObj })
  },
})
const page = computed({
  get: () => teacherData.value?.data.page ?? 1,
  set: (newValue) => {
    router.push({ query: { ...route.query, page: newValue } })
  },
})
const limit = computed({
  get: () => teacherData.value?.data.limit ?? 10,
  set: (newValue) => {
    router.push({ query: { ...route.query, limit: newValue, page: 1 } })
  },
})

const dataTable = computed(() => teacherData.value?.data.items || [])
const pageFrom = computed(() => (page.value - 1) * limit.value + 1 || 0)
const pageTo = computed(() =>
  Math.min(page.value * limit.value, teacherData.value?.data.total ?? 1)
)

const handleDeleteTeacher = async () => {
  await deleteTeacher(deleteId.value)
    .then(() => refresh())
    .finally(() => {
      deleteId.value = ''
      isPopupOpen.value = false
    })
}

const handleActionClick = async (action: string, id: string) => {
  switch (action) {
    case 'detail':
      route.params.id = id
      isDetailSceenOpen.value = true
      return
    case 'change':
      route.params.id = id
      route.params.method = 'edit'
      isDetailSceenOpen.value = true
      return
    case 'delete':
      deleteId.value = id
      return (isPopupOpen.value = true)
    default:
      return
  }
}

const columns = [
  {
    key: 'teacherCode',
    label: 'teacherCode',
    sortable: true,
  },
  {
    key: 'name',
    sortable: true,
  },
  {
    key: 'gender',
    sortable: true,
  },
  {
    key: 'phone',
    sortable: true,
  },
  {
    key: 'email',
    sortable: true,
  },
  {
    key: 'type',
    sortable: true,
  },
  {
    key: 'status',
    sortable: true,
  },
  {
    key: 'actions',
  },
]
const actionsData = [
  [
    {
      label: 'view_detail',
      icon: 'i-heroicons-eye',
      value: 'detail',
    },
  ],
  [
    {
      label: 'change',
      icon: 'i-heroicons-pencil-square',
      value: 'change',
    },
  ],
  [
    {
      label: 'delete',
      icon: 'i-heroicons-archive-box-x-mark',
      value: 'delete',
    },
  ],
]
</script>

<style>
em {
  color: #f87171;
  font-style: normal;
}
</style>
