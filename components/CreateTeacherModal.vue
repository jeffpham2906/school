<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h1>Create teacher</h1>
      </template>
      <UForm
        :state="state"
        :schema="teacherSchema"
        @submit="onSubmit"
        @error="onError"
        ref="form"
      >
        <div class="grid grid-cols-2 gap-3.5 mb-3.5">
          <UFormGroup label="Tên" name="name" required>
            <UInput v-model="state.name" />
          </UFormGroup>
          <UFormGroup label="Mã giáo viên" name="teacherCode" required>
            <UInput v-model="state.teacherCode" />
          </UFormGroup>
        </div>
        <div class="grid grid-cols-2 gap-3.5 mb-3.5">
          <UFormGroup label="Email" name="email" required>
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Phone" name="phone" required>
            <UInput v-model="state.phone" />
          </UFormGroup>
        </div>
        <div class="grid grid-cols-3 gap-3.5 mb-3.5">
          <UFormGroup label="Giới tính" name="gender">
            <USelect v-model="state.gender" :options="genderOptions" />
          </UFormGroup>
          <UFormGroup label="Quốc tịch" name="nationality">
            <USelect v-model="state.nationality" :options="nationOptions" />
          </UFormGroup>
          <UFormGroup label="Ngày sinh" name="dateOfBirth">
            <UPopover>
              <UButton
                icon="i-heroicons-calendar-days-20-solid"
                :label="format(new Date(state.dateOfBirth), 'd MMM, yyy')"
                color="gray"
              />
              <template #panel="{ close }">
                <DatePicker
                  v-model:model-value="state.dateOfBirth"
                  @close="close"
                />
              </template>
            </UPopover>
          </UFormGroup>
        </div>
        <div class="grid grid-cols-2 gap-3.5 mb-3.5">
          <UFormGroup label="Số bảo hiểm" name="healthInsuranceNumber" required
            ><UInput v-model="state.healthInsuranceNumber"
          /></UFormGroup>
          <UFormGroup label="Số CMND/CCCD" name="identityNumber" required
            ><UInput v-model="state.identityNumber"
          /></UFormGroup>
        </div>
        <div class="grid grid-cols-2 gap-3.5 mb-3.5">
          <UFormGroup
            label="Địa chỉ thường trú"
            name="permanentResidence"
            required
            ><UInput v-model="state.permanentResidence"
          /></UFormGroup>
          <UFormGroup label="Địa chỉ hiện nay" name="currentAddress" required
            ><UInput v-model="state.currentAddress"
          /></UFormGroup>
        </div>
        <div class="grid grid-cols-2 gap-3.5 mb-3.5">
          <UFormGroup label="Ghi chú" name="note"
            ><UInput v-model="state.note"
          /></UFormGroup>
          <div class="grid grid-cols-2 gap-3.5">
            <UFormGroup label="Loại" name="type">
              <USelect v-model="state.type" :options="typeOptions" />
            </UFormGroup>
            <UFormGroup label="Status" name="status"
              ><USelect
                v-model="state.status"
                :options="['active', 'inactive']"
                :ui="{ base: 'capitalize' }"
            /></UFormGroup>
          </div>
        </div>

        <div class="flex flex-row-reverse gap-3 mt-8 mb-0.5">
          <UButton
            class="w-20 items-center justify-center"
            icon="i-heroicons-plus"
            :trailing="true"
            type="submit"
            >Tạo</UButton
          ><UButton
            variant="ghost"
            class="w-20 items-center justify-center"
            :trailing="true"
            @click="isOpen = false"
            >Huỷ</UButton
          >
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import { format } from 'date-fns'
import type { Gender, Status, Teacher } from '~/types/teacher.types'
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { createTeacher } from '~/services/teachers'
import type { AsyncData } from '#app'

const props = defineProps({
  refreshData: Function,
})

const isOpen = defineModel()
const form = ref()

const genderOptions = [
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
]
const nationOptions = ['Việt Nam', 'Mỹ']
const typeOptions = [
  {
    value: 'official',
    label: 'Chính thức',
  },
  {
    value: 'contract',
    label: 'Hợp đồng',
  },
  {
    value: 'partime',
    label: 'Tạm thời',
  },
]
const initialState: Teacher = {
  name: '',
  teacherCode: '',
  email: '',
  phone: '',
  dateOfBirth: new Date(),
  gender: 'male',
  nationality: 'Việt Nam',
  healthInsuranceNumber: '',
  identityNumber: '',
  permanentResidence: '',
  currentAddress: '',
  note: '',
  status: 'active',
  type: 'official',
}
const state = reactive(initialState)
const phoneRegex =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/
//Schema validation
const teacherSchema = yup.object({
  name: yup
    .string()
    .required('Vui lòng nhập tên')
    .min(6, 'Tối thiểu 6 ký tự')
    .max(30, 'Tối đa là 30 ký tự'),
  teacherCode: yup
    .string()
    .required('Vui lòng nhập mã giáo viên')
    .min(6, 'Tối thiểu là 6 ký tự')
    .max(20, 'Tối đa là 20 ký tự'),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ'),
  phone: yup
    .string()
    .matches(phoneRegex, 'SĐT không hợp lệ')
    .required('Vui lòng nhập SĐT'),
  dateOfBirth: yup.date().default(() => new Date()),
  gender: yup.string<Gender>(),
  nationality: yup.string().required('Vui lòng nhập quốc tịch'),
  healthInsuranceNumber: yup
    .string()
    .required('Vui lòng nhập sổ bảo hiểm')
    .min(6, 'Tối thiểu 6 ký tự')
    .max(20, 'Tối đa là 20 ký tự'),
  identityNumber: yup
    .string()
    .required('Vui lòng nhập CMT/CCCD')
    .min(6, 'Tối thiểu 6 ký tự')
    .max(15, 'Tối đa là 15 ký tự'),
  permanentResidence: yup
    .string()
    .required('Vui lòng nhập địa chỉ')
    .max(20, 'Tối đa là 20 ký tự'),
  currentAddress: yup
    .string()
    .required('Vui lòng nhập địa chỉ')
    .max(20, 'Tối đa là 20 ký tự'),
  note: yup.string(),
  status: yup.string<Status>(),
  type: yup.string(),
})

const onSubmit = async (event: FormSubmitEvent<Teacher>) => {
  form.value.clear()
  const { data, error } = (await createTeacher(event.data)) as AsyncData<
    { data: object },
    { data: { error: { issues: { path: string; message: string }[] } } }
  >
  const errorData = error.value?.data?.error
  if (data.value?.data) {
    useToast().add({ title: 'Tạo thành công' })
    await props.refreshData?.()
    isOpen.value = false
  }
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
  }
}
const onError = async (event: FormErrorEvent) => {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
