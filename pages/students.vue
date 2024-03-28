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
      <h1 class="text-2xl font-semibold">Học Sinh</h1>
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
        <!-- <USelect
          v-model="typeSelected"
          :options="typeOptions"
          :ui="{ base: 'capitalize' }"
        />
        <USelect
          v-model="statusSelected"
          :options="statusOptions"
          :ui="{ base: 'capitalize' }"
        /> -->
      </div>
      <UButton
        label="Thêm mới"
        icon="i-heroicons-plus"
        :trailing="true"
        @click="isOpen = true"
      />
    </div>
    <UTable :columns="columns" :rows="dataTable" :loading="pending || loading">
      <template #actions-data="">
        <UButton label="Delete" variant="ghost" />
      </template>
    </UTable>
    <template #footer>
      <div
        class="absolute bottom-5 left-8 right-8 flex justify-between items-center"
      >
        <UPagination
          v-model="page"
          :page-count="1"
          :total="5"
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
import { getAllStudents, type GetAllStudentsProps } from '~/services/students'
import type { GetResponseData } from '~/types'
import type { Student } from '~/types/student.types'

definePageMeta({
  layout: 'applayout',
})

const router = useRouter()
const route = useRoute()
const loading = ref(false)
// Limit record per page
const limitOptions = [10, 20, 50]
const limitSelected = ref(route.query.limit || limitOptions[0])
watch(limitSelected, () => {
  const newRoute = { ...route.query, limit: limitSelected.value }
  router.push({
    path: route.fullPath,
    query: newRoute,
  })
})

// Page
const page = ref(route.query.page || 1)
watch(page, () => {
  const newRoute = { ...route.query, page: page.value }
  router.push({
    path: route.fullPath,
    query: newRoute,
  })
})
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

const queries = computed((): GetAllStudentsProps => {
  const limit = Number(route.query.limit) || 10
  return { limit }
})
//Fetch Data
const { data, pending, refresh } = (await getAllStudents(queries)) as AsyncData<
  { data: GetResponseData<Student> },
  unknown
>

const dataTable = computed(() => {
  return (
    data?.value?.data.items.map((stu) => {
      return {
        studentCode: stu.studentCode,
        name: stu.name,
        gender: stu.gender,
        dateOfBirth: VietnamTime.getVNTime(stu.dateOfBirth),
      }
    }) || []
  )
})

const columns = [
  {
    key: 'studentCode',
    label: 'Mã học sinh',
  },
  {
    key: 'name',
    label: 'Tên',
  },
  {
    key: 'gender',
    label: 'Gender',
  },
  {
    key: 'dateOfBirth',
    label: 'Ngày sinh',
  },
  {
    key: 'actions',
    label: 'Actions',
  },
]

const isOpen = ref(false)
</script>
