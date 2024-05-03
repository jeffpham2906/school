<template>
  <USlideover v-model="isOpen" :ui="{ width: 'max-w-6xl' }">
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
          <h1 v-if="isCreate">{{ $t('add_teacher') }}</h1>
          <h1 v-else>
            {{ isEdited ? $t('change_teacher') : $t('detail_teacher') }}
          </h1>
          <div class="flex gap-2">
            <UButton
              v-show="status === Action.Detail"
              icon="i-heroicons-pencil-square"
              variant="ghost"
              :label="$t('change')"
              @click="status = Action.Change"
            />
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="isOpen = false"
            />
          </div>
        </div>
      </template>
      <UForm
        :state="teacher"
        :schema="teacherSchema"
        @submit="onSubmit"
        @error="onError"
        ref="form"
        :validateOn="['submit']"
        class="h-full max-h-[600px]"
      >
        <div class="h-full grid grid-rows-2">
          <div
            class="grid grid-cols-[150px,1fr,1fr,1fr] grid-rows-[auto,1fr,1fr,1fr,1fr] h-full items-center gap-x-10"
          >
            <h1 class="col-start-1 col-end-5">{{ $t('personal_infor') }}</h1>
            <div class="row-start-2 row-end-7 justify-center flex">
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
                  v-show="isEdited"
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
            <UInlineFormGroup :label="$t('teacherCode')">
              <UInput
                v-model="teacher.teacherCode"
                :disabled="!isEdited || isCreate"
                :placeholder="$t('auto_gen')"
                :focus="$el.focus"
              />
            </UInlineFormGroup>
            <UInlineFormGroup :label="$t('gender')" name="gender">
              <ISelect
                v-model="teacher.gender"
                :options="['male', 'female', 'other']"
                :placeholder="$t('select_gender')"
                :disabled="!isEdited"
              >
                <template #labelValue>
                  {{ $t(teacher.gender || 'select_gender') }}
                </template>
              </ISelect>
            </UInlineFormGroup>
            <UInlineFormGroup label="Email" name="email" required>
              <UInput v-model="teacher.email" :disabled="!isEdited" />
            </UInlineFormGroup>
            <UInlineFormGroup :label="$t('name')" name="name" required>
              <UInput v-model="teacher.name" :disabled="!isEdited" />
            </UInlineFormGroup>
            <UInlineFormGroup :label="$t('nationality')">
              <UInput v-model="teacher.nationality" :disabled="!isEdited" />
            </UInlineFormGroup>
            <UInlineFormGroup :label="$t('phone')" name="phone" required>
              <UInput v-model="teacher.phone" :disabled="!isEdited" />
            </UInlineFormGroup>
            <UInlineFormGroup :label="$t('date_of_birth')">
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
                  :disabled="!isEdited"
                />
                <template #panel="{ close }">
                  <DatePicker
                    v-model:model-value="teacher.dateOfBirth"
                    @close="close"
                  />
                </template>
              </UPopover>
            </UInlineFormGroup>
            <div class="col-start-3 col-end-5">
              <UInlineFormGroup
                :label="$t('permanentResidence')"
                name="permanentResidence"
                required
              >
                <UInput
                  class="w-3/5"
                  v-model="teacher.permanentResidence"
                  :disabled="!isEdited"
                />
              </UInlineFormGroup>
            </div>
            <UInlineFormGroup :label="$t('passport')" name="passport" required>
              <UInput v-model="teacher.passport" :disabled="!isEdited" />
            </UInlineFormGroup>
            <div class="col-start-3 col-end-5">
              <UInlineFormGroup
                :label="$t('currentAddress')"
                name="currentAddress"
                required
              >
                <UInput
                  class="w-3/5"
                  v-model="teacher.currentAddress"
                  :disabled="!isEdited"
                />
              </UInlineFormGroup>
            </div>
          </div>
          <div
            class="grid grid-cols-[150px,1fr,1fr,1fr] grid-rows-[24px,auto,auto,1fr] gap-x-10 gap-y-6"
          >
            <h1 class="col-start-1 col-end-5">{{ $t('general_infor') }}</h1>
            <div class="row-start-2 row-end-4"></div>
            <UInlineFormGroup :label="$t('type')">
              <ISelect
                v-model="teacher.type"
                :options="['official', 'contract', 'parttime']"
                :disabled="!isEdited"
              >
                <template #labelValue>
                  {{ $t(teacher.type) }}
                </template>
              </ISelect>
            </UInlineFormGroup>

            <div class="col-start-3 col-end-5 items-center flex pl-[136px]">
              <UInlineFormGroup :label="$t('status')">
                <ISelect
                  v-model="teacher.status"
                  :options="['active', 'disabled']"
                  :disabled="!isEdited"
                  class="w-[142px]"
                >
                  <template #labelValue>
                    {{ $t(teacher.status) }}
                  </template>
                </ISelect>
              </UInlineFormGroup>
            </div>

            <UInlineFormGroup :label="$t('note')">
              <UTextarea v-model="teacher.note" :disabled="!isEdited" />
            </UInlineFormGroup>

            <div
              class="col-start-3 col-end-5 flex items-center gap-4 pl-[136px]"
            >
              <UInlineFormGroup :label="$t('contracts')" name="contracts">
                <UDropdown
                  :items="[teacher?.contracts]"
                  :ui="{
                    wrapper: 'w-full',
                    item: {
                      base: 'justify-between',
                    },
                  }"
                  class="w-[142px]"
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
                      v-if="isEdited"
                    />
                  </template>
                </UDropdown>
              </UInlineFormGroup>
              <div
                class="flex items-center justify-center mt-1"
                v-show="isEdited"
              >
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
        </div>
      </UForm>
      <template #footer>
        <div class="flex gap-6">
          <UButton
            v-show="isEdited"
            class="w-24 items-center justify-center"
            :trailing="true"
            @click="form.submit()"
          >
            {{ isCreate ? $t('add') : $t('change') }}
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
import { teacherSchema } from '~/schema'
import { format } from 'date-fns'
import USpin from '../USpin.vue'

const emit = defineEmits(['callRefresh'])
let initState: Teacher = {
  avatar: undefined,
  contracts: [],
  name: '',
  teacherCode: '',
  email: '',
  phone: '',
  gender: Gender.Male,
  dateOfBirth: new Date(Date.now()),
  nationality: '',
  passport: '',
  permanentResidence: '',
  healthInsuranceNumber: '',
  currentAddress: '',
  status: Status.Active,
  type: Type.Contract,
  note: '',
}
const teacher = ref<Teacher>(initState)
const route = useRoute()
const { data, execute, error } = await useAPI<Data<GetOne<Teacher>, null>>(
  `/teachers/${route.params.id}`,
  {
    immediate: false,
    lazy: true,
  }
)

const isOpen = defineModel()
const form = ref()
const fileAvatar = ref()
const fileContracts = ref()
const modal = useModal()

const toast = useToast()

const status = ref<string>(String(route.params.method))
const isChange = computed({
  get: () => status.value === Action.Change,
  set: (value) => {
    if (value) {
      status.value = Action.Change
    }
  },
})
const isCreate = computed(() => status.value === Action.Create)
const isEdited = computed(() => !!(isChange.value || isCreate.value))

onMounted(async () => {
  if (!isCreate.value) {
    modal.open(USpin)
    await execute().finally(() => modal.close())
    if (data.value) {
      teacher.value = data.value?.data.record
      initState = { ...toRaw(teacher.value) }
    } else if (!data.value && error.value) {
      toast.add({ title: 'Something went wrong' })
    }
  }
})

const handleFileChange = async (e: Event, field: string) => {
  if (!teacher) return
  modal.open(USpin)
  // @ts-expect-error file
  const file = e.target.files[0]
  if (field === 'avatar') {
    teacher.value.avatar = await doUpload(file).finally(() => modal.close())
  } else if (field === 'contracts') {
    const newContract = await doUpload(file).finally(() => modal.close())
    if (newContract) {
      if (teacher.value.contracts) {
        teacher.value.contracts.push(newContract)
      } else {
        teacher.value.contracts = [newContract]
      }
    }
  }
}
const handleDeleteContract = (contract: Avatar) => {
  teacher.value.contracts = teacher.value.contracts?.filter(
    (item) => item.key !== contract.key
  )
}

const onSubmit = async (event: FormSubmitEvent<Teacher>) => {
  form.value.clear()
  modal.open(USpin)
  let err
  if (isCreate.value) {
    const { error } = await createTeacher(event.data).finally(() => {
      toast.add({
        title: 'Tạo thành công',
        timeout: 2000,
        icon: 'i-heroicons-check-circle',
      })
      modal.close()
    })
    err = error.value?.data
  } else if (isChange.value) {
    const data = getDiffObject(initState, event.data) as Teacher
    console.log(initState)
    console.log(event.data)
    data.email = teacher.value.email
    data.phone = teacher.value.phone
    const { error } = await updateTeacher(data).finally(() => {
      toast.add({
        title: 'Sửa thành công',
        timeout: 2000,
        icon: 'i-heroicons-check-circle',
      })
      modal.close()
    })
    err = error.value?.data
  }

  if (err) {
    const errMsg = err.error.issues.map((e: Issue) => {
      return {
        path: e.path[0],
        message: e.message,
      }
    })
    if (errMsg) {
      return form.value.setErrors(errMsg)
    } else {
      toast.add({ title: 'Error' })
    }
  }
  emit('callRefresh')
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
