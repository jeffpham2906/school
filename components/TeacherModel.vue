<template>
  <USlideover v-model="isOpen" :ui="{ width: 'max-w-5xl' }" prevent-close>
    <UCard
      class="flex flex-col flex-1"
      :ui="{
        body: { base: 'flex-1' },
        footer: { base: 'flex flex-row-reverse' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex justify-between">
          <h1>
            {{
              isAdd
                ? $t('add_teacher')
                : isChange
                  ? $t('change_teacher')
                  : $t('detail_teacher')
            }}
          </h1>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>
      <UForm
        :state="state"
        :schema="teacherSchema"
        @submit="onSubmit"
        @error="onError"
        ref="form"
        :validateOn="['submit']"
        class="h-full"
      >
        <div class="grid grid-cols-4 gap-6">
          <UFormGroup
            v-if="!isAdd"
            :label="$t('teacherCode')"
            name="teacherCode"
            required
          >
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput v-else v-model="state.teacherCode" :disabled="isDetail" />
          </UFormGroup>
          <UFormGroup label="Email" name="email" required>
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput v-else v-model="state.email" :disabled="isDetail" />
          </UFormGroup>
          <UFormGroup :label="$t('phone')" name="phone" required>
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput v-else v-model="state.phone" :disabled="isDetail" />
          </UFormGroup>
          <UFormGroup
            :label="$t('contracts')"
            name="contracts"
            :ui="{ hint: 'cursor-pointer text-gray-500 dark:text-gray-200' }"
          >
            <template #hint v-if="!isDetail">
              <div @click="fileContracts.click()">
                <label>
                  <UButton
                    icon="i-heroicons-plus"
                    class="w-5 h-5 flex items-center justify-center"
                    :ui="{ rounded: 'rounded-full' }"
                    color="gray"
                  />
                </label>
                <input
                  type="file"
                  @change="handleFileChange($event, 'contracts')"
                  accept=".jpg, .jpeg, .png, .doc, .docx, .pdf"
                  class="absolute inset-0 opacity-80"
                  hidden
                  ref="fileContracts"
                  :disabled="isDetail"
                />
              </div>
            </template>
            <USkeleton v-if="pending" class="w-full h-8" />
            <UDropdown
              v-else
              :items="[state.contracts]"
              :ui="{
                wrapper: 'w-full',
                item: {
                  base: 'justify-between',
                },
              }"
            >
              <UButton
                variant="outline"
                color="gray"
                block
                class="text-sm text-gray-900 dark:text-white"
                :ui="{
                  color: {
                    gray: {
                      outline:
                        'ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
                    },
                  },
                }"
                :label="`${$t('all')} (${state.contracts?.length || '0'})`"
              />
              <template #item="{ item }">
                <ULink :to="item.url" target="_blank" class="truncate">
                  {{ item.filename }}
                </ULink>
                <UButton
                  v-show="!isDetail"
                  icon="i-heroicons-x-mark"
                  color="gray"
                  variant="ghost"
                  @click="handleDeleteContract(item)"
                />
              </template>
            </UDropdown>
          </UFormGroup>
          <UFormGroup :label="$t('name')" name="name" required>
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput v-else v-model="state.name" :disabled="isDetail" />
          </UFormGroup>
          <UFormGroup :label="$t('date_of_birth')" name="dateOfBirth">
            <USkeleton v-if="pending" class="w-full h-8" />
            <UPopover v-else>
              <UButton
                icon="i-heroicons-calendar-days-20-solid"
                :label="
                  format(
                    new Date(state.dateOfBirth || new Date()),
                    'd MMM, yyy'
                  )
                "
                color="gray"
                class="w-full"
                :disabled="isDetail"
              />
              <template #panel="{ close }">
                <DatePicker
                  v-model:model-value="state.dateOfBirth"
                  @close="close"
                />
              </template>
            </UPopover>
          </UFormGroup>
          <UFormGroup :label="$t('gender')" name="gender">
            <USkeleton v-if="pending" class="w-full h-8" />
            <ISelect
              v-else
              :disabled="isDetail"
              v-model="state.gender"
              :options="['male', 'female', 'other']"
              :placeholder="$t('select_gender')"
            >
              <template #labelValue>
                {{ $t(state.gender || 'select_gender') }}
              </template>
            </ISelect>
          </UFormGroup>
          <UFormGroup :label="$t('nationality')" name="nationality">
            <USkeleton v-if="pending" class="w-full h-8" />
            <ISelect
              v-else
              v-model="state.nationality"
              :options="['vietnam']"
              :disabled="isDetail"
            />
          </UFormGroup>
          <UFormGroup
            :label="$t('healthInsuranceNumber')"
            name="healthInsuranceNumber"
          >
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              v-model="state.healthInsuranceNumber"
              :disabled="isDetail"
            />
          </UFormGroup>
          <UFormGroup :label="$t('passport')" name="passport" required>
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput v-else v-model="state.passport" :disabled="isDetail" />
          </UFormGroup>
          <UFormGroup
            :label="$t('permanentResidence')"
            name="permanentResidence"
            required
          >
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              v-model="state.permanentResidence"
              :disabled="isDetail"
            />
          </UFormGroup>
          <UFormGroup
            :label="$t('currentAddress')"
            name="currentAddress"
            required
          >
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              v-model="state.currentAddress"
              :disabled="isDetail"
            />
          </UFormGroup>
          <UFormGroup :label="$t('classCode')" name="currentClassId">
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              v-model="state.currentClassId"
              :disabled="isDetail"
            />
          </UFormGroup>
          <UFormGroup :label="$t('type')" name="type">
            <USkeleton v-if="pending" class="w-full h-8" />
            <ISelect
              v-else
              :disabled="isDetail"
              v-model="state.type"
              :options="['official', 'contract', 'parttime']"
            >
              <template #labelValue>
                {{ $t(state.type) }}
              </template>
            </ISelect>
          </UFormGroup>
          <UFormGroup :label="$t('status')" name="status">
            <USkeleton v-if="pending" class="w-full h-8" />
            <ISelect
              v-else
              :disabled="isDetail"
              v-model="state.status"
              :options="['active', 'disabled']"
              :placeholder="$t('select_status')"
            >
              <template #labelValue>
                {{ $t(state.status || 'select_status') }}
              </template>
            </ISelect>
          </UFormGroup>
          <UFormGroup :label="$t('note')" name="note">
            <USkeleton v-if="pending" class="w-full h-20" />
            <UInput v-else v-model="state.note" :disabled="isDetail" />
          </UFormGroup>
          <div class="col-start-4 row-start-1 row-span-4">
            <UCard
              :ui="{
                ring: '',
                shadow: '',
                body: {
                  base: 'flex items-center justify-center',
                },
                footer: {
                  base: 'flex justify-center items-center',
                },
              }"
            >
              <UAvatar
                :src="state.avatar?.url"
                :ui="{
                  size: {
                    '3xl': 'h-32 w-32',
                  },
                }"
                size="3xl"
                icon="i-heroicons-user"
                class="relative"
              >
                <div
                  v-if="!isDetail"
                  class="absolute right-0 bottom-0"
                  @click="fileAvatar.click()"
                >
                  <label>
                    <UButton
                      icon="i-heroicons-camera"
                      class="w-8 h-8 cursor-pointer"
                      :ui="{ rounded: 'rounded-full' }"
                      color="gray"
                    />
                  </label>
                  <input
                    type="file"
                    class="opacity-0 absolute inset-0"
                    @change="handleFileChange($event, 'avatar')"
                    ref="fileAvatar"
                    hidden
                  />
                </div>
              </UAvatar>

              <template #footer>
                {{ initialValue.name }}
              </template>
            </UCard>
          </div>
        </div>
        <!-- <div class="grid grid-rows-2 h-full">
          <div
            class="grid grid-cols-[0.6fr,1fr,1fr,1fr] grid-rows-5 h-full items-center gap-x-10"
          >
            <h1 class="col-span-4">Thong tin ca nhan</h1>
            <div class="row-start-2 row-end-6 justify-center flex">
              <UAvatar
                :src="state.avatar?.url"
                :ui="{
                  size: {
                    '3xl': 'h-36 w-36',
                  },
                }"
                size="3xl"
                icon="i-heroicons-user"
                class="relative"
              >
                <div
                  v-if="!isDetail"
                  class="absolute right-0 bottom-0"
                  @click="fileAvatar.click()"
                >
                  <label>
                    <UButton
                      icon="i-heroicons-camera"
                      class="w-8 h-8 cursor-pointer"
                      :ui="{ rounded: 'rounded-full' }"
                      color="gray"
                    />
                  </label>
                  <input
                    type="file"
                    class="opacity-0 absolute inset-0"
                    @change="handleFileChange($event, 'avatar')"
                    ref="fileAvatar"
                    hidden
                  />
                </div>
              </UAvatar>
            </div>
            <IFormGroup :label="$t('teacherCode')">
              <USkeleton v-if="pending" class="w-full h-8" />
              <UInput
                v-else
                v-model="state.email"
                :disabled="isDetail"
                class="w-36"
              />
            </IFormGroup>

            <IFormGroup :label="$t('name')">
              <USkeleton v-if="pending" class="w-full h-8" />
              <UInput
                v-else
                v-model="state.email"
                :disabled="isDetail"
                class="w-36"
              />
            </IFormGroup>
            <IFormGroup :label="$t('date_of_birth')">
              <USkeleton v-if="pending" class="w-full h-8" />
              <UInput
                v-else
                v-model="state.email"
                :disabled="isDetail"
                class="w-36"
              />
            </IFormGroup>
            <IFormGroup :label="$t('passport')">
              <USkeleton v-if="pending" class="w-full h-8" />
              <UInput
                v-else
                v-model="state.email"
                :disabled="isDetail"
                class="w-36"
              />
            </IFormGroup>
            <div
              class="grid grid-cols-2 gap-x-10 h-full col-start-3 col-end-5 row-start-2 row-end-6"
            >
              <IFormGroup :label="$t('gender')">
                <USkeleton v-if="pending" class="w-full h-8" />
                <UInput
                  v-else
                  v-model="state.email"
                  :disabled="isDetail"
                  class="w-36"
                />
              </IFormGroup>
              <IFormGroup :label="$t('Email')">
                <USkeleton v-if="pending" class="w-full h-8" />
                <UInput
                  v-else
                  v-model="state.email"
                  :disabled="isDetail"
                  class="w-36"
                />
              </IFormGroup>
              <IFormGroup :label="$t('nationality')">
                <USkeleton v-if="pending" class="w-full h-8" />
                <UInput
                  v-else
                  v-model="state.email"
                  :disabled="isDetail"
                  class="w-36"
                />
              </IFormGroup>

              <IFormGroup :label="$t('phone')">
                <USkeleton v-if="pending" class="w-full h-8" />
                <UInput
                  v-else
                  v-model="state.email"
                  :disabled="isDetail"
                  class="w-36"
                />
              </IFormGroup>
              <div class="col-start-1 col-end-3">
                <IFormGroup :label="$t('phone')">
                  <USkeleton v-if="pending" class="w-full h-8" />
                  <UInput
                    v-else
                    v-model="state.email"
                    :disabled="isDetail"
                    class="w-36"
                  />
                </IFormGroup>
              </div>
              <div class="col-start-1 col-end-3">
                <IFormGroup :label="$t('phone')">
                  <USkeleton v-if="pending" class="w-full h-8" />
                  <UInput
                    v-else
                    v-model="state.email"
                    :disabled="isDetail"
                    class="w-36"
                  />
                </IFormGroup>
              </div>
            </div>
          </div>
          <div>
            <h1>Thong tin chung</h1>
          </div>
        </div> -->
      </UForm>
      <template #footer v-if="!isDetail">
        <div class="flex gap-6">
          <UButton
            class="w-24 items-center justify-center"
            :trailing="true"
            @click="form.submit()"
            :disabled="isDetail"
          >
            {{ $t(isAdd ? 'add' : isChange ? 'change' : 'Button') }}
          </UButton>
          <UButton
            variant="ghost"
            class="w-24 items-center justify-center"
            :trailing="true"
            @click="isOpen = false"
          >
            {{ $t('cancel') }}
          </UButton>
        </div>
      </template>
    </UCard>
  </USlideover>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { type Detail, type FileData } from '~/types'
import type { Teacher } from '~/types/teacher.types'
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { createTeacher } from '~/services/teachers'
import { teacherSchema } from '~/schema'
import type { AsyncData } from '#app'
import USpin from './USpin.vue'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/ban-types
  refreshFc: Function
}>()

let initialValue: Teacher = {
  avatar: undefined,
  contracts: undefined,
  email: '',
  phone: '',
  dateOfBirth: undefined,
  name: '',
  gender: 'male',
  nationality: 'Việt Nam',
  healthInsuranceNumber: '',
  passport: '',
  currentClassId: '',
  pastClassIds: [],
  permanentResidence: '',
  currentAddress: '',
  note: '',
  type: 'official',
  status: 'active',
}

const isOpen = defineModel()

const fileContracts = ref()
const fileAvatar = ref()
const form = ref()
const state = ref<Teacher>(initialValue)

const route = useRoute()
const modal = useModal()

const isChange = computed(() => route.query.status === 'change')
const isDetail = computed(() => route.query.status === 'detail')
const isAdd = computed(() => route.query.status === 'add')

const pending = computed(() => status.value === 'pending')

const { data, execute, status } = (await getTeacher(
  route.params.id + ''
)) as AsyncData<Detail<Teacher>, unknown>

const handleFileChange = async (e: Event, field: string) => {
  modal.open(USpin)
  // @ts-expect-error file
  const file = e.target.files[0]

  if (field === 'avatar') {
    state.value.avatar = await doUpload(file).finally(() => modal.close())
  } else if (field === 'contracts') {
    const newContract = await doUpload(file).finally(() => modal.close())
    if (newContract) {
      if (state.value.contracts) {
        state.value.contracts = [...state.value.contracts, newContract]
      } else {
        state.value.contracts = [newContract]
      }
    }
  }
}

const handleDeleteContract = (contract: FileData) => {
  state.value.contracts = state.value.contracts?.filter(
    (item) => item.key !== contract.key
  )
}
const onSubmit = async (event: FormSubmitEvent<Teacher>) => {
  form.value.clear()
  modal.open(USpin)
  let res
  let resError

  if (isChange.value) {
    const data = getDiffObject(initialValue, event.data)
    //@ts-expect-error email
    data.email = state.value.email
    //@ts-expect-error phone
    data.phone = state.value.phone
    const { data: resUpdate, error: errUpdate } = await updateTeacher(
      data,
      String(route.params.id)
    )
    res = resUpdate.value
    resError = errUpdate.value
  } else if (isAdd.value) {
    const { error: errCreate, data: resCreate } = await createTeacher(
      event.data
    )
    res = resCreate.value
    resError = errCreate.value
  }

  if (resError) {
    const errorData = resError?.data?.error
    if (errorData) {
      const errMsg = errorData.issues.map(
        (e: { path: string; message: string }) => {
          return {
            path: e.path[0],
            message: e.message,
          }
        }
      )
      return form.value.setErrors(errMsg)
    } else {
      useToast().add({ title: resError?.data.message })
    }
    modal.close()
  }
  if (res) {
    await props.refreshFc()
    useToast().add({
      title: isChange.value ? 'Sửa thành công' : isAdd && 'Tạo thành công',
      icon: 'i-heroicons-check-circle',
    })
    modal.close()
    return (isOpen.value = false)
  }
}
const onError = async (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
onMounted(async () => {
  if (route.params.id) {
    await execute()
    const newState = data.value?.data?.record as Teacher
    state.value = newState
    initialValue = { ...newState }
  }
})

onUnmounted(() => {
  delete route.params.id
  delete route.query.status
})
</script>
