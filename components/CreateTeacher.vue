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
            {{ $t('add_teacher') }}
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
          <UFormGroup label="Email" name="email" required>
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup :label="$t('phone')" name="phone" required>
            <UInput v-model="state.phone" />
          </UFormGroup>
          <UFormGroup
            :label="$t('contracts')"
            name="contracts"
            :ui="{ hint: 'cursor-pointer text-gray-500 dark:text-gray-200' }"
          >
            <template #hint>
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
                />
              </div>
            </template>

            <UDropdown
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
                  icon="i-heroicons-x-mark"
                  color="gray"
                  variant="ghost"
                  @click="handleDeleteContract(item)"
                />
              </template>
            </UDropdown>
          </UFormGroup>
          <UFormGroup :label="$t('name')" name="name" required>
            <UInput v-model="state.name" />
          </UFormGroup>
          <UFormGroup :label="$t('date_of_birth')" name="dateOfBirth">
            <UPopover>
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
            <ISelect
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
            <ISelect v-model="state.nationality" :options="['vietnam']" />
          </UFormGroup>
          <UFormGroup
            :label="$t('healthInsuranceNumber')"
            name="healthInsuranceNumber"
          >
            <UInput v-model="state.healthInsuranceNumber" />
          </UFormGroup>
          <UFormGroup :label="$t('passport')" name="passport" required>
            <UInput v-model="state.passport" />
          </UFormGroup>
          <UFormGroup
            :label="$t('permanentResidence')"
            name="permanentResidence"
            required
          >
            <UInput v-model="state.permanentResidence" />
          </UFormGroup>
          <UFormGroup
            :label="$t('currentAddress')"
            name="currentAddress"
            required
          >
            <UInput v-model="state.currentAddress" />
          </UFormGroup>
          <UFormGroup :label="$t('classCode')" name="currentClassId">
            <UInput v-model="state.currentClassId" />
          </UFormGroup>
          <UFormGroup :label="$t('type')" name="type">
            <ISelect
              v-model="state.type"
              :options="['official', 'contract', 'parttime']"
            >
              <template #labelValue>
                {{ $t(state.type) }}
              </template>
            </ISelect>
          </UFormGroup>
          <UFormGroup :label="$t('status')" name="status">
            <ISelect
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
            <UInput v-model="state.note" />
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
              <UInput v-model="state.email" class="w-36" />
            </IFormGroup>

            <IFormGroup :label="$t('name')">
              <UInput v-model="state.email" class="w-36" />
            </IFormGroup>
            <IFormGroup :label="$t('date_of_birth')">
              <UInput v-model="state.email" class="w-36" />
            </IFormGroup>
            <IFormGroup :label="$t('passport')">
              <UInput v-model="state.email" class="w-36" />
            </IFormGroup>
            <div
              class="grid grid-cols-2 gap-x-10 h-full col-start-3 col-end-5 row-start-2 row-end-6"
            >
              <IFormGroup :label="$t('gender')">
                <UInput v-model="state.email" class="w-36" />
              </IFormGroup>
              <IFormGroup :label="$t('Email')">
                <UInput v-model="state.email" class="w-36" />
              </IFormGroup>
              <IFormGroup :label="$t('nationality')">
                <UInput v-model="state.email" class="w-36" />
              </IFormGroup>

              <IFormGroup :label="$t('phone')">
                <UInput v-model="state.email" class="w-36" />
              </IFormGroup>
              <div class="col-start-1 col-end-3">
                <IFormGroup :label="$t('phone')">
                  <UInput v-model="state.email" class="w-36" />
                </IFormGroup>
              </div>
              <div class="col-start-1 col-end-3">
                <IFormGroup :label="$t('phone')">
                  <UInput v-model="state.email" class="w-36" />
                </IFormGroup>
              </div>
            </div>
          </div>
          <div>
            <h1>Thong tin chung</h1>
          </div>
        </div> -->
      </UForm>
      <template #footer>
        <div class="flex gap-6">
          <UButton
            class="w-24 items-center justify-center"
            :trailing="true"
            @click="form.submit()"
          >
            {{ $t('add') }}
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
import {
  Gender,
  Type,
  type Teacher,
  Status,
  type Avatar,
} from '~/types/teacher.types'
import { type Issue } from '~/types'
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { createTeacher } from '~/services/teachers'
import { teacherSchema } from '~/schema'
import USpin from './USpin.vue'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/ban-types
  refreshFc: Function
}>()

const initValue = {
  email: '',
  phone: '',
  dateOfBirth: undefined,
  name: '',
  gender: Gender.Male,
  nationality: 'Việt Nam',
  healthInsuranceNumber: '',
  passport: '',
  permanentResidence: '',
  currentAddress: '',
  note: '',
  type: Type.Contract,
  status: Status.Active,
}
const isOpen = defineModel()

const fileContracts = ref()
const fileAvatar = ref()
const form = ref()
const state = ref<Teacher>(initValue)

const modal = useModal()
const toast = useToast()

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

const handleDeleteContract = (contract: Avatar) => {
  state.value.contracts = state.value.contracts?.filter(
    (item) => item.key !== contract.key
  )
}
const onSubmit = async (event: FormSubmitEvent<Teacher>) => {
  form.value.clear()
  modal.open(USpin)
  const { error } = await createTeacher(event.data).finally(() => modal.close())
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
    title: 'Thêm thành công',
    timeout: 2000,
    icon: 'i-heroicons-check-circle',
  })
  isOpen.value = false
  state.value = initValue
}
const onError = async (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
