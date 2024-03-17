<template>
  <div v-if="pending">Loading ...</div>
  <UCard
    v-else
    class="h-full relative"
    :ui="{
      base: '',
      ring: '',
      shadow: '',
      divide: '',
    }"
  >
    <template #header>
      <h1 class="text-2xl font-semibold">List Students</h1>
    </template>

    <div class="px-4 pb-3 flex justify-between items-center">
      <UInput
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Search..."
        class="w-64"
        v-model="searchQuery"
      />
      <UButton icon="i-heroicons-plus" :trailing="true">Create</UButton>
    </div>
    <div class="px-4 py-3 flex justify-between">
      <div class="flex items-center gap-1.5">
        <span>Rows per page :</span>
        <USelectMenu v-model="limit" :options="rowsOption" />
      </div>
      <div class="flex gap-1.5 items-center">
        <USelectMenu
          v-model="selectedColumns"
          :options="columns"
          multiple
          :uiMenu="{ width: 'w-32' }"
        >
          <UButton color="gray" size="xs">Columns</UButton>
        </USelectMenu>
        <UButton icon="i-heroicons-funnel" color="gray" size="xs"
          >Reset</UButton
        >
      </div>
    </div>
    <UTable :rows="filterRows" :columns="columsTable">
      <template #actions-data="">
        <UButton
          variant="outline"
          size="2xs"
          icon="i-heroicons-trash"
          label="Delete"
          :trailing="true"
        />
      </template>
    </UTable>
    <template #footer>
      <div class="absolute bottom-6 right-6">
        <!-- <UPagination
          v-if="students"
          v-model="page"
          :total="students.total"
          :page-count="2"
        /> -->
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { getAllStudents, getStudents } from '~/services/students'
import type { AllStudents, ResponeStudents } from '~/types/student.types'
const router = useRouter()
const route = useRoute()
const { data: students, pending } = await getAllStudents({
  query: {},
})

const rowsOption = [10, 20, 50]
const rowsOptionSelected = ref(rowsOption[0])
const columns = [
  {
    key: 'code',
    label: 'Code',
  },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'gender',
    label: 'Gender',
  },
  {
    key: 'dateOfBirth',
    label: 'DateOfBirth',
  },
  { key: 'class', label: 'Class' },
  {
    key: 'actions',
    label: 'Actions',
  },
]
const selectedColumns = ref(columns)
const columsTable = computed(() =>
  columns.filter((c) => selectedColumns.value.includes(c))
)
// Limit record per page
const limit = ref(route.query.limit || '10')
watch(limit, (limit) => {
  router.push({
    path: route.path,
    query: { ...route.query, limit: limit },
  })
})

// Page
const page = ref(route.query.page || 1)
watch(page, (page) => {
  router.push({
    path: route.fullPath,
    query: { ...route.query, page: page },
  })
})

// Search
const searchQuery = ref('')
watch(searchQuery, (searchQuery) => {
  console.log(searchQuery)
})

const dataTable = computed(() => {
  return students.value?.items.map((e) => {
    return {
      code: e.studentCode,
      name: e.name,
      gender: e.gender,
      dateOfBirth: VietnamTime.getVNTime(e.dateOfBirth),
      class: '...',
      homeroomTeacher: '...',
    }
  })
})
const filterRows = computed(() => {
  if (!route.query.search) {
    return dataTable.value
  }
  return dataTable.value?.filter((row) => {
    return row.name.includes('' + route.query.search)
  })
})
</script>
