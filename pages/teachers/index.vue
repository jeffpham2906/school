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
    <PopUp
      v-model="isPopupOpen"
      @onLeftClick="handleDeleteTeacher"
      :loading="isLoading"
    />
    <TeacherModel v-if="isOpen" v-model="isOpen" :refresh-fc="refresh" />
    <template #header>
      <HeaderPage>Giáo viên</HeaderPage>
    </template>
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex gap-2">
        <SeachBar v-model="searchQuery" />
        <SelectFilter
          :options="[
            { label: 'Giới tính', value: 'gender' },
            { label: 'Nam', value: 'male' },
            { label: 'Nữ', value: 'female' },
            { label: 'Khác', value: 'other' },
          ]"
          label-filter="filter[gender]"
        />
        <SelectFilter
          :options="[
            { label: 'Loại', value: 'type' },
            { label: 'Chính thức', value: 'official' },
            { label: 'Hợp đồng', value: 'contract' },
            { label: 'Parttime', value: 'parttime' },
          ]"
          label-filter="filter[type]"
        />
        <SelectFilter
          :options="[
            { label: 'Trạng thái', value: 'status' },
            { label: 'Active', value: 'active' },
            { label: 'Disabled', value: 'disabled' },
          ]"
          label-filter="filter[status]"
        />
        <USelect :options="sortOptions" />
        <UButton
          label="Reset"
          icon="i-heroicons-funnel"
          size="xs"
          variant="solid"
          color="white"
          to="/teachers"
        />
      </div>

      <UButton
        label="Thêm mới"
        icon="i-heroicons-plus"
        :trailing="true"
        @click="isOpen = true"
      />
    </div>
    <UTable
      :columns="columns"
      :rows="dataTable"
      :loading="pending || isLoading"
    >
      <template #name-data="{ row }">
        <span
          :class="[
            searchQuery !== '' &&
              row.slug.includes(stringToSlug(searchQuery)) &&
              'text-green-600',
          ]"
        >
          {{ row.name }}
        </span>
      </template>
      <template #gender-data="{ row }">
        <span class="capitalize">{{ row.gender }}</span>
      </template>
      <template #type-data="{ row }">
        <span class="capitalize">{{ row.type }}</span>
      </template>
      <template #status-data="{ row }">
        <UBadge
          :label="row.status === 'active' ? 'Active' : 'Disabled'"
          variant="soft"
          :color="row.status === 'active' ? 'primary' : 'white'"
          size="xs"
      /></template>
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
                :label="item.label"
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
            :total="totalPages"
            :max="5"
            size="xs"
          />
          <span class="text-sm"
            >Showing {{ pageFrom }} to {{ pageTo }} of
            {{ totalResults }} results</span
          >
        </div>
        <span class="flex items-center gap-1.5 text-sm"
          >Rows per page :
          <SelectFilter
            :options="[
              { label: '10', value: '10' },
              { label: '20', value: '20' },
              { label: '50', value: '50' },
            ]"
            label-filter="limit"
            size="xs"
        /></span>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { AsyncData } from '#app'
import { useQuery } from '~/composables/useQuery'
import { deleteTeacher, getAllTeachers } from '~/services/teachers'
import type { GetResponseData } from '~/types'
import type { Teacher } from '~/types/teacher.types'

definePageMeta({
  layout: 'applayout',
})

const route = useRoute()
const isOpen = ref(false)

const isPopupOpen = ref(false)
const searchQuery = ref('')
const deleteId = ref('')

const isLoading = ref(false)
const { queries, setRoute } = useQuery()
const page = ref(Number(route.query?.page) || 1)

watch(page, () => {
  setRoute({ page: page.value })
})

const sortOptions = [
  { label: 'sort' },
  { label: 'sort by id (recent first)', value: -1, labelSort: 'id' },
  { label: 'sort by id (earlier)', value: 1, labelSort: 'id' },
]
// const sort = ref()

// Fetch Data
const { data, refresh, pending } = (await getAllTeachers(queries)) as AsyncData<
  { data: GetResponseData<Teacher> },
  unknown
>
const handleDeleteTeacher = async () => {
  isLoading.value = true
  await deleteTeacher(deleteId.value)
    .then(() => refresh())
    .finally(() => {
      deleteId.value = ''
      isPopupOpen.value = false
      isLoading.value = false
    })
}

const handleActionClick = (action: string, id: string) => {
  switch (action) {
    case 'detail':
      route.params.id = id
      return (isOpen.value = true)
    case 'delete':
      deleteId.value = id
      return (isPopupOpen.value = true)
    default:
      return
  }
}
const dataTable = computed(() => data.value?.data.items || [])
const totalPages = computed(() => data.value?.data.totalPages || 1)
const totalResults = computed(() => data.value?.data.total || 0)
const pageFrom = computed(
  () => (page.value - 1) * (Number(route.query.limit) || 10) + 1 || 0
)
const pageTo = computed(
  () =>
    Math.min(
      page.value * (Number(route.query.limit) || 10),
      totalResults.value
    ) || ''
)

const columns = [
  {
    key: 'teacherCode',
    label: 'Mã giáo viên',
  },
  {
    key: 'name',
    label: 'Tên giáo viên',
  },
  {
    key: 'gender',
    label: 'Giới tính',
  },
  {
    key: 'phone',
    label: 'SĐT',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'type',
    label: 'Loại',
  },
  {
    key: 'status',
    label: 'Trạng thái',
  },
  {
    key: 'actions',
    label: '...',
  },
]
const actionsData = [
  [
    {
      label: 'View detail',
      icon: 'i-heroicons-eye',
      value: 'detail',
    },
  ],
  [
    {
      label: 'Delete',
      icon: 'i-heroicons-archive-box-x-mark',
      value: 'delete',
    },
  ],
]
</script>
