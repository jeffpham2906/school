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
    <template #header>
      <h1 class="text-2xl font-semibold">Giáo Viên</h1>
    </template>
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex gap-2">
        <UInput
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Tìm kiếm theo tên/mã"
          class="w-64"
        />
        <USelect
          v-model="genderSelected"
          :options="genderOptions"
          :ui="{ base: 'capitalize' }"
        />
        <USelect
          v-model="typeSelected"
          :options="typeOptions"
          :ui="{ base: 'capitalize' }"
        />
        <USelect
          v-model="statusSelected"
          :options="statusOptions"
          :ui="{ base: 'capitalize' }"
        />
      </div>
      <UButton
        label="Thêm mới"
        icon="i-heroicons-plus"
        :trailing="true"
        @click="isOpen = true"
      />
      <CreateTeacherModal v-model="isOpen" :refreshData="refresh" />
    </div>
    <UTable
      :columns="columns"
      :rows="dataTable"
      :loading="pending || isLoading"
    >
      <template #actions-data="{ row }">
        <UButton
          label="Delete"
          variant="ghost"
          @click="handleDeleteTeacher(row.id)"
        />
      </template>
    </UTable>
    <template #footer>
      <div
        class="absolute bottom-5 left-8 right-8 flex justify-between items-center"
      >
        <UPagination
          v-model="page"
          :page-count="1"
          :total="totalPages"
          :max="5"
          size="xs"
        />
        <span class="flex items-center gap-1.5 text-sm"
          >Rows per page :
          <USelectMenu
            size="xs"
            v-model="limitSelected"
            :options="limitOptions"
        /></span>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { AsyncData } from '#app'
import type { LocationQueryValue } from 'vue-router'
import CreateTeacherModal from '~/components/CreateTeacherModal.vue'
import {
  deleteTeacher,
  getAllTeachers,
  type GetAllTeachersProps,
} from '~/services/teachers'
import type { TeacherData } from '~/types/teacher.types'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
// Page
const page = ref(Number(route.query?.page) || 1)
watch(page, () => {
  const newRoute = { ...route.query, page: page.value }
  router.push({ path: route.fullPath, query: newRoute })
})

// Limit records
const limitOptions = [10, 20, 50]
const limitSelected = ref(route.query.limit || limitOptions[0])
watch(limitSelected, () => {
  const newRoute = { ...route.query, limit: limitSelected.value, page: 1 }
  page.value = 1
  router.push({ path: route.fullPath, query: newRoute })
})

// Queries
const queries = computed((): GetAllTeachersProps => {
  const query = route.query as Record<string, LocationQueryValue>
  const limit = parseInt(query.limit || '10')
  const page = parseInt(query.page || '1')
  return {
    limit: limit,
    page: page,
    'filter[gender]': query['filter[gender]'],
    'filter[type]': query['filter[type]'],
    'filter[status]': query['filter[status]'],
  }
})

// Fetch Data
const { data, pending, refresh } = (await getAllTeachers(queries)) as AsyncData<
  { data: TeacherData },
  unknown
>
const handleDeleteTeacher = async (id: string) => {
  isLoading.value = true
  await deleteTeacher(id)
  await refresh()
  isLoading.value = false
}
const dataTable = computed(() => data.value?.data.items || [])
const totalPages = computed(() => data.value?.data.totalPages || 1)

// Gender
const genderOptions = ['gender', 'male', 'female', 'other']
const genderSelected = ref(route.query['filter[gender]'] || genderOptions[0])
watch(genderSelected, () => {
  const newRoute = {
    ...route.query,
    'filter[gender]': genderSelected.value,
  }
  if (genderSelected.value === 'gender') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete newRoute['filter[gender]']
  }
  router.push({ path: route.fullPath, query: newRoute })
})

// Type
const typeOptions = ['loại', 'official', 'contract', 'partime']
const typeSelected = ref(route.query['filter[type]'] || typeOptions[0])
watch(typeSelected, () => {
  const newRoute = {
    ...route.query,
    'filter[type]': typeSelected.value,
  }
  if (typeSelected.value === 'loại') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete newRoute['filter[type]']
  }
  router.push({ path: route.fullPath, query: newRoute })
})

// Status
const statusOptions = ['status', 'active', 'inactive']
const statusSelected = ref(route.query['filter[status]'] || statusOptions[0])
watch(statusSelected, () => {
  const newRoute = {
    ...route.query,
    'filter[status]': statusSelected.value,
  }
  if (statusSelected.value === 'status') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete newRoute['filter[status]']
  }
  router.push({ path: route.fullPath, query: newRoute })
})
// Columns Table
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
    label: 'Actions',
  },
]

// Modal Create
const isOpen = ref(false)
</script>
