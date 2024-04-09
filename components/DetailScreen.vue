<template>
  <USlideover v-model="isOpen" :ui="{ width: 'max-w-7xl' }" prevent-close>
    <UCard
      class="flex flex-col flex-1"
      :ui="{
        base: 'relative',
        body: { base: 'h-full mb-16' },
        footer: {
          base: 'flex flex-row-reverse absolute bottom-0 left-0 right-0',
        },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex justify-between">
          <h1>
            {{ $t('detail_teacher') }}
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
        :state="teacher"
        :schema="teacherSchema"
        @submit="onSubmit"
        @error="onError"
        ref="form"
        :validateOn="['submit']"
        class="h-full"
      >
        <div class="h-full grid grid-rows-[1fr,0.9fr]">
          <div
            class="grid grid-cols-7 grid-rows-[auto,1fr,1fr,1fr,1fr] h-full items-center gap-x-10"
          >
            <h1 class="col-start-1 col-end-8">{{ $t('personal_infor') }}</h1>
            <div class="row-start-2 row-end-6 justify-center flex">
              <UAvatar
                :src="teacher?.avatar?.url"
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
                  class="absolute right-0 bottom-0"
                  @click="fileAvatar.click()"
                  v-show="isEdit"
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
            <ULabel :label="$t('teacherCode')" />
            <UFormGroup name="teacherCode">
              <UInput v-model="teacher.teacherCode" :disabled="!isEdit" />
              <template #error="{ error }">
                <span class="absolute">{{ error }}</span>
              </template>
            </UFormGroup>
            <ULabel :label="$t('gender')" name="gender" />
            <ISelect
              v-model="teacher.gender"
              :options="['male', 'female', 'other']"
              :placeholder="$t('select_gender')"
              :disabled="!isEdit"
            >
              <template #labelValue>
                {{ $t(teacher.gender || 'select_gender') }}
              </template>
            </ISelect>
            <ULabel label="Email" />
            <UFormGroup name="email">
              <UInput v-model="teacher.email" :disabled="!isEdit" />
              <template #error="{ error }">
                <span class="absolute">{{ error }}</span>
              </template>
            </UFormGroup>
            <ULabel :label="$t('name')" />
            <UFormGroup name="name">
              <UInput v-model="teacher.name" :disabled="!isEdit" />
              <template #error="{ error }">
                <span class="absolute">{{ error }}</span>
              </template>
            </UFormGroup>
            <ULabel :label="$t('nationality')" />
            <UInput v-model="teacher.nationality" :disabled="!isEdit" />
            <ULabel :label="$t('phone')" />
            <UFormGroup name="phone">
              <UInput v-model="teacher.phone" :disabled="!isEdit" />
              <template #error="{ error }">
                <span class="absolute">{{ error }}</span>
              </template>
            </UFormGroup>
            <ULabel :label="$t('date_of_birth')" />
            <UPopover>
              <UButton
                icon="i-heroicons-calendar-days-20-solid"
                :label="
                  format(
                    new Date(teacher.dateOfBirth || new Date()),
                    'd MMM, yyy'
                  )
                "
                color="gray"
                class="w-full"
                :disabled="!isEdit"
              />
              <template #panel="{ close }">
                <DatePicker
                  v-model:model-value="teacher.dateOfBirth"
                  @close="close"
                />
              </template>
            </UPopover>
            <ULabel :label="$t('permanentResidence')" />
            <div class="col-start-5 col-end-8">
              <UFormGroup name="permanentResidence">
                <UInput
                  v-model="teacher.permanentResidence"
                  class="w-full max-w-80"
                  :disabled="!isEdit"
                />
                <template #error="{ error }">
                  <span class="absolute">{{ error }}</span>
                </template>
              </UFormGroup>
            </div>
            <ULabel :label="$t('passport')" />
            <UFormGroup name="passport">
              <UInput v-model="teacher.passport" :disabled="!isEdit" />
              <template #error="{ error }">
                <span class="absolute">{{ error }}</span>
              </template>
            </UFormGroup>
            <ULabel :label="$t('currentAddress')" />
            <div class="col-start-5 col-end-8">
              <UFormGroup name="currentAddress">
                <UInput
                  v-model="teacher.currentAddress"
                  class="w-full max-w-80"
                  :disabled="!isEdit"
                />
                <template #error="{ error }">
                  <span class="absolute">{{ error }}</span>
                </template>
              </UFormGroup>
            </div>
          </div>
          <div
            class="grid grid-cols-7 grid-rows-[30px,1fr,1fr,1fr] items-center"
          >
            <h1 class="col-start-1 col-end-8">{{ $t('general_infor') }}</h1>
            <div></div>
            <ULabel :label="$t('type')" />
            <ISelect
              v-model="teacher.type"
              :options="['official', 'contract', 'parttime']"
              :disabled="!isEdit"
            >
              <template #labelValue>
                {{ $t(teacher.type) }}
              </template>
            </ISelect>
            <div></div>
            <ULabel :label="$t('status')" />
            <ISelect
              v-model="teacher.status"
              :options="['active', 'disabled']"
              :disabled="!isEdit"
            >
              <template #labelValue>
                {{ $t(teacher.status) }}
              </template>
            </ISelect>
            <div></div>
            <div></div>
            <ULabel :label="$t('note')" />
            <UTextarea
              v-model="teacher.note"
              :disabled="!isEdit"
              class="col-start-3 col-end-4 row-start-3 row-end-5"
            />
            <div></div>
            <ULabel :label="$t('contracts')" />
            <UFormGroup
              name="contracts"
              :ui="{ hint: 'cursor-pointer text-gray-500 dark:text-gray-200' }"
            >
              <UDropdown
                :items="[teacher?.contracts]"
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
                  :label="`${$t('all')} (${teacher?.contracts?.length || '0'})`"
                />
                <template #item="{ item }">
                  <ULink :to="item.url" target="_blank" class="truncate">
                    {{ item.filename }}
                  </ULink>
                  <UButton
                    icon="i-heroicons-x-mark"
                    color="gray"
                    variant="ghost"
                    @click="handleDeleteContract(item)"
                    v-if="isEdit"
                  />
                </template>
              </UDropdown>
            </UFormGroup>
            <div class="flex items-center justify-center" v-if="isEdit">
              <div @click="fileContracts.click()">
                <label>
                  <UButton
                    icon="i-heroicons-plus"
                    label="Upload"
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
                />
              </div>
            </div>
          </div>
        </div>
      </UForm>
      <template #footer>
        <div class="flex gap-6">
          <UButton
            v-show="isEdit"
            class="w-24 items-center justify-center"
            :trailing="true"
            @click="form.submit()"
          >
            {{ $t('change') }}
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
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import type { Data, GetOne, Issue } from '~/types'
import {
  Gender,
  Status,
  Type,
  type Teacher,
  type Avatar,
} from '~/types/teacher.types'
import USpin from './USpin.vue'
import { teacherSchema } from '~/schema'
import { format } from 'date-fns'
const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/ban-types
  refreshFc: Function
}>()

const isOpen = defineModel()
const form = ref()
const fileAvatar = ref()
const fileContracts = ref()
const modal = useModal()
const route = useRoute()
const toast = useToast()
const isEdit = computed(() => route.params.method === 'edit')

const { data } = await useAPI<Data<GetOne<Teacher>, null>>(
  `/teachers/${route.params.id}`
)
const temp = {
  avatar: { key: '', bucket: '', url: '', ext: '', filename: '' },
  contracts: [],
  name: '',
  teacherCode: '',
  email: '',
  phone: '',
  gender: Gender.Male,
  dateOfBirth: '',
  nationality: '',
  passport: '',
  permanentResidence: '',
  healthInsuranceNumber: '',
  currentAddress: '',
  status: Status.Active,
  type: Type.Contract,
  note: '',
}
const teacher = data.value?.data.record || temp
const initState = { ...teacher }

const handleFileChange = async (e: Event, field: string) => {
  if (!teacher) return
  modal.open(USpin)
  // @ts-expect-error file
  const file = e.target.files[0]
  if (field === 'avatar') {
    teacher.avatar = await doUpload(file).finally(() => modal.close())
  } else if (field === 'contracts') {
    const newContract = await doUpload(file).finally(() => modal.close())
    if (newContract) {
      if (teacher.contracts) {
        teacher.contracts = [...teacher.contracts, newContract]
      } else {
        teacher.contracts = [newContract]
      }
    }
  }
}
const handleDeleteContract = (contract: Avatar) => {
  teacher.contracts = teacher.contracts?.filter(
    (item) => item.key !== contract.key
  )
}

const onSubmit = async (event: FormSubmitEvent<Teacher>) => {
  form.value.clear()
  modal.open(USpin)
  const data = getDiffObject(initState, event.data) as Teacher
  data.email = teacher.email
  data.phone = teacher.phone

  const { error } = await updateTeacher(data).finally(() => modal.close())
  const err = error.value?.data.error.issues
  if (err) {
    const errMsg = err.map((e: Issue) => {
      return {
        path: e.path[0],
        message: e.message,
      }
    })
    return form.value.setErrors(errMsg)
  }
  await props.refreshFc()
  toast.add({
    title: 'Sửa thành công',
    timeout: 2000,
    icon: 'i-heroicons-check-circle',
  })
  isOpen.value = false
}
const onError = async (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
onUnmounted(() => {
  delete route.params.id
  delete route.params.method
})
</script>
