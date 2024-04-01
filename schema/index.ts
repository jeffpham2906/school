import * as yup from 'yup'
import { phoneRegex } from '~/types'
import type { Gender, Status, Teacher, Type } from '~/types/teacher.types'

export const teacherSchema = yup.object<Teacher>({
  name: yup.string().required('Vui lòng nhập tên'),
  avatar: yup.mixed(),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ'),
  phone: yup
    .string()
    .required('Vui lòng nhập SĐT')
    .matches(phoneRegex, 'SĐT không hợp lệ'),
  dateOfBirth: yup.date().default(() => new Date()),
  gender: yup.string<Gender>(),
  nationality: yup.string(),
  healthInsuranceNumber: yup.string(),
  passport: yup.string().required('Vui lòng nhập CMT/CCCD'),
  permanentResidence: yup.string().required('Vui lòng nhập địa chỉ'),
  currentAddress: yup.string().required('Vui lòng nhập địa chỉ'),
  note: yup.string(),
  status: yup.string<Status>(),
  type: yup.string<Type>().required('Vui lòng nhập loại'),
})

export const userLoginSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(6, 'Username at least 6 character'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password at least 6 character'),
})
