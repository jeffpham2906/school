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
            {{ isEdited ? `Thông tin giáo viên ` : 'Thêm giáo viên' }}
          </h1>
          <div>
            <UButton
              variant="ghost"
              color="gray"
              icon="i-heroicons-pencil-square"
              class="-my-1"
              label="Sửa"
              v-show="isEdited"
              @click="isEditing = true"
            />
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </div>
      </template>
      <UForm
        :state="state"
        :schema="teacherSchema"
        @submit="onSubmit"
        @error="onError"
        ref="form"
        :validateOn="['submit']"
      >
        <div class="grid grid-cols-4 gap-6">
          <UFormGroup label="Email" name="email" required>
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              v-model="state.email"
              :disabled="isEdited ? !isEditing : false"
            />
          </UFormGroup>
          <UFormGroup label="Phone" name="phone" required>
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              v-model="state.phone"
              :disabled="isEdited ? !isEditing : false"
            />
          </UFormGroup>
          <!-- <UFormGroup label="Avatar" name="avatar">
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              :value="state.avatar?.filename"
              :disabled="isEdited ? !isEditing : false"
            />
          </UFormGroup> -->
          <UFormGroup label="Hợp đồng" name="contracts">
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else-if="!isEdited || isEditing"
              type="file"
              multiple
              @change="handleFileChange($event, 'contracts')"
              accept=".jpg, .jpeg, .png, .doc, .docx, .pdf"
            />
            <UDropdown
              v-else
              :items="[state.contracts]"
              :ui="{ wrapper: 'w-full' }"
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
                :label="`Tất cả (${state.contracts?.length || '0'})`"
              />
              <template #item="{ item }">
                <ULink :to="item.url" target="_blank">
                  {{ item.filename }}
                </ULink>
              </template>
            </UDropdown>
          </UFormGroup>
          <UFormGroup label="Tên" name="name" required>
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              v-model="state.name"
              :disabled="isEdited ? !isEditing : false"
            />
          </UFormGroup>
          <UFormGroup label="Ngày sinh" name="dateOfBirth">
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
                :disabled="isEdited ? !isEditing : false"
              />
              <template #panel="{ close }">
                <DatePicker
                  v-model:model-value="state.dateOfBirth"
                  @close="close"
                />
              </template>
            </UPopover>
          </UFormGroup>
          <UFormGroup label="Giới tính" name="gender">
            <USkeleton v-if="pending" class="w-full h-8" />
            <USelect
              :disabled="isEdited ? !isEditing : false"
              v-else
              v-model="state.gender"
              :options="[
                {
                  value: 'male',
                  label: 'Nam',
                },
                {
                  value: 'female',
                  label: 'Nữ',
                },
                {
                  value: 'other',
                  label: 'Khác',
                },
              ]"
            />
          </UFormGroup>
          <UFormGroup label="Quốc tịch" name="nationality">
            <USkeleton v-if="pending" class="w-full h-8" />
            <USelect
              v-else
              v-model="state.nationality"
              :options="['Việt Nam']"
              :disabled="isEdited ? !isEditing : false"
            />
          </UFormGroup>
          <UFormGroup label="Số bảo hiểm" name="healthInsuranceNumber">
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              v-model="state.healthInsuranceNumber"
              :disabled="isEdited ? !isEditing : false"
            />
          </UFormGroup>
          <UFormGroup label="Số CMND/CCCD" name="passport" required>
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              v-model="state.passport"
              :disabled="isEdited ? !isEditing : false"
            />
          </UFormGroup>
          <UFormGroup
            label="Địa chỉ thường trú"
            name="permanentResidence"
            required
          >
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              v-model="state.permanentResidence"
              :disabled="isEdited ? !isEditing : false"
            />
          </UFormGroup>
          <UFormGroup label="Địa chỉ hiện nay" name="currentAddress" required>
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              v-model="state.currentAddress"
              :disabled="isEdited ? !isEditing : false"
            />
          </UFormGroup>
          <UFormGroup label="Mã lớp học" name="currentClassId">
            <USkeleton v-if="pending" class="w-full h-8" />
            <UInput
              v-else
              v-model="state.currentClassId"
              :disabled="isEdited ? !isEditing : false"
            />
          </UFormGroup>
          <UFormGroup label="Loại" name="type">
            <USkeleton v-if="pending" class="w-full h-8" />
            <USelect
              v-else
              :disabled="isEdited ? !isEditing : false"
              v-model="state.type"
              :options="[
                {
                  value: 'official',
                  label: 'Chính thức',
                },
                {
                  value: 'contract',
                  label: 'Hợp đồng',
                },
                {
                  value: 'parttime',
                  label: 'Tạm thời',
                },
              ]"
            />
          </UFormGroup>
          <UFormGroup label="Trạng thái" name="status">
            <USkeleton v-if="pending" class="w-full h-8" />
            <USelect
              v-else
              :disabled="isEdited ? !isEditing : false"
              v-model="state.status"
              :options="[
                { label: 'Hoạt động', value: 'active' },
                {
                  label: 'Không hoạt động',
                  value: 'disabled',
                },
              ]"
            />
          </UFormGroup>
          <UFormGroup label="Ghi chú" name="note">
            <USkeleton v-if="pending" class="w-full h-20" />
            <UTextarea
              v-else
              v-model="state.note"
              :disabled="isEdited ? !isEditing : false"
            />
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
                icon="i-heroicons-camera"
                class="relative"
              >
                <div
                  v-if="!isEdited || isEditing"
                  class="absolute right-0 bottom-0"
                >
                  <UButton
                    icon="i-heroicons-camera"
                    class="w-8 h-8"
                    :ui="{ rounded: 'rounded-full' }"
                    color="gray"
                  />
                  <UInput
                    type="file"
                    class="w-8 h-8 opacity-0 absolute inset-0"
                    @change="handleFileChange($event, 'avatar')"
                  />
                </div>
              </UAvatar>

              <template #footer>
                {{ initialValue.name }}
              </template>
            </UCard>
          </div>
        </div>
      </UForm>
      <template #footer>
        <div class="flex gap-6">
          <UButton
            class="w-24 items-center justify-center"
            :trailing="true"
            @click="form.submit()"
            :disabled="isEdited ? !isEditing : false"
            :loading="isLoading"
          >
            {{ isEdited ? 'Sửa' : 'Tạo' }}
          </UButton>
          <UButton
            variant="ghost"
            class="w-24 items-center justify-center"
            :trailing="true"
            @click="isOpen = false"
          >
            Huỷ
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
  gender: undefined,
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
const route = useRoute()
const isOpen = defineModel()
const isEdited = computed(() => !!route.params.id)
const isEditing = ref(false)
const form = ref()
const state = ref<Teacher>(initialValue)
const pending = computed(() => status.value === 'pending')
const isLoading = ref(false)
const { data, execute, status } = (await getTeacher(
  route.params.id + ''
)) as AsyncData<Detail<Teacher>, unknown>

const handleFileChange = async (
  e: { target: { files: File[] } },
  field: string
) => {
  if (field === 'avatar') {
    state.value.avatar = await doUpload(e.target.files[0])
  } else if (field === 'contracts') {
    const fileArr = Array.from(e.target.files)
    const arrUploadImage = fileArr.map((file) => doUpload(file))
    Promise.all(arrUploadImage).then(
      (data) => (state.value.contracts = data as FileData[])
    )
    console.log(state.value)
  }
}
// (state.value.contracts = data as FileData[])
const onSubmit = async (event: FormSubmitEvent<Teacher>) => {
  form.value.clear()
  isLoading.value = true
  let res
  let resError

  if (isEdited.value) {
    const data = getDiffObject(initialValue, event.data)
    //@ts-expect-error email
    data.email = state.value.email
    //@ts-expect-error phone
    data.phone = state.value.phone
    const { data: resUpdate, error: errUpdate } = await updateTeacher(
      data,
      String(route.params.id)
    ).finally(() => (isLoading.value = false))
    res = resUpdate.value
    resError = errUpdate.value
  } else {
    const { error: errCreate, data: resCreate } = await createTeacher(
      event.data
    ).finally(() => (isLoading.value = false))
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
      form.value.setErrors(errMsg)
    } else {
      useToast().add({ title: resError?.data.message })
    }
    return
  }
  if (res) {
    await props.refreshFc()
    useToast().add({
      title: isEdited.value ? 'Sửa thành công' : 'Tạo thành công',
    })
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
    initialValue = toRaw({ ...newState })
  }
  console.log(state.value)
})

onUnmounted(() => {
  delete route.params.id
})
</script>
