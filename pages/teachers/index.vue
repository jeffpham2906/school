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
    <PopUp v-model="isPopupOpen" @onLeftClick="handleDeleteTeacher" />
    <TeacherModel v-if="isOpen" v-model="isOpen" :refresh-fc="refresh" />
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
        @click="
          () => {
            isOpen = true
            $route.query.status = 'add'
          }
        "
      />
    </div>
    <UTable :columns="columns" :rows="dataTable" :loading="pending">
      <template #teacherCode-header>
        {{ $t('teacherCode') }}
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
            :total="totalPages"
            :max="5"
            size="xs"
          />
          <span class="text-sm">
            {{
              `${$t('show_from')} ${pageFrom} ${$t('to')} ${pageTo} ${$t('on')} ${totalResults} ${$t('results')}`
            }}
          </span>
        </div>
        <span class="flex items-center gap-1.5 text-sm">
          {{ $t('rows_per_page') }}
          <USelectMenu
            :options="[10, 20, 50]"
            placeholder="10"
            size="xs"
            v-model="limit"
          />
        </span>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { AsyncData } from '#app'
import USpin from '~/components/USpin.vue'
import { useQuery } from '~/composables/useQuery'
import { deleteTeacher, getAllTeachers } from '~/services/teachers'
import type { GetResponseData } from '~/types'
import type { Teacher } from '~/types/teacher.types'

definePageMeta({
  layout: 'applayout',
})
const route = useRoute()
const modal = useModal()
const isOpen = ref(false)

const isPopupOpen = ref(false)
const searchQuery = ref(route.query.search || '')
const deleteId = ref('')

const { queries, setRoute } = useQuery()
const page = ref(Number(route.query?.page) || 1)
watch(page, () => {
  setRoute({ page: page.value, limit: limit.value })
})
const limit = ref(Number(route.query?.limit) || 10)
watch(limit, async () => {
  useRouter().replace({
    path: route.fullPath,
    query: { limit: limit.value, page: 1 },
  })
  page.value = 1
})
// Fetch Data
const { data, refresh, pending } = (await getAllTeachers(queries)) as AsyncData<
  { data: GetResponseData<Teacher> },
  unknown
>
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

const handleDeleteTeacher = async () => {
  modal.open(USpin)
  await deleteTeacher(deleteId.value)
    .then(() => refresh())
    .finally(() => {
      deleteId.value = ''
      isPopupOpen.value = false
      modal.close()
    })
}

const handleActionClick = (action: string, id: string) => {
  switch (action) {
    case 'detail':
      route.params.id = id
      route.query.status = 'detail'
      return (isOpen.value = true)
    case 'change':
      route.params.id = id
      route.query.status = 'change'
      return (isOpen.value = true)
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
  },
  {
    key: 'name',
  },
  {
    key: 'gender',
  },
  {
    key: 'phone',
  },
  {
    key: 'email',
  },
  {
    key: 'type',
  },
  {
    key: 'status',
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
