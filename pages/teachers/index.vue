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
    <CreateTeacherModal v-model="isOpen" :refreshData="refresh" />
    <template #header>
      <HeaderPage>Giáo viên</HeaderPage>
    </template>
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex gap-2">
        <SeachBar v-model="searchQuery" />
        <SelectFilter :label-options="['gender', 'male', 'female', 'other']" />
        <SelectFilter
          :label-options="['type', 'official', 'contract', 'parttime']"
        />
        <SelectFilter :label-options="['status', 'active', 'disabled']" />
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
      <template #teacherCode-data="{ row }">
        <span
          :class="[
            searchQuery !== '' &&
              row.slug.includes(stringToSlug(searchQuery)) &&
              'text-green-600',
          ]"
        >
          {{ row.teacherCode }}
        </span>
      </template>
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
            :label-options="[10, 20, 50]"
            label-filter="limit"
            size="xs"
        /></span>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { AsyncData } from '#app'
import CreateTeacherModal from '~/components/CreateTeacherModal.vue'
import { useQuery } from '~/composables/useQuery'
import { deleteTeacher, getAllTeachers } from '~/services/teachers'
import type { GetResponseData } from '~/types'
import type { Teacher } from '~/types/teacher.types'

const route = useRoute()
const toast = useToast()
const isLoading = ref(false)
const isOpen = ref(false)
const isPopupOpen = ref(false)
const searchQuery = ref('')
const deleteId = ref('')

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
const { data, pending, refresh } = (await getAllTeachers(queries)) as AsyncData<
  { data: GetResponseData<Teacher> },
  unknown
>
const handleDeleteTeacher = async () => {
  isLoading.value = true
  const { error } = await deleteTeacher(deleteId.value)
  if (error.value) {
    return toast.add({
      title: error.value.message,
      icon: 'i-heroicons-x-circle',
      color: 'red',
      timeout: 2500,
    })
  }
  refresh()
    .then(() =>
      toast.add({
        title: 'Xoá thành công',
        timeout: 2500,
        icon: 'i-heroicons-check-circle',
      })
    )
    .finally(() => {
      deleteId.value = ''
      isLoading.value = false
      isPopupOpen.value = false
    })
}
const dataTable = computed(() => data.value?.data.items || [])
const totalPages = computed(() => data.value?.data.totalPages || 1)
const totalResults = computed(() => data.value?.data.total || 0)
const pageFrom = computed(
  () => (page.value - 1) * (Number(route.query.limit) || 10) + 1 || ''
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
const handleActionClick = (action: string, id: string) => {
  switch (action) {
    case 'detail':
      return navigateTo(`${route.path}/${id}`)
    case 'delete':
      deleteId.value = id
      return (isPopupOpen.value = true)
    default:
      return
  }
}
</script>
