import * as yup from 'yup'

import type { Gender, Status, Teacher, Type } from '~/types/teacher.types'
const phoneRegex =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/

export const teacherSchema = yup.object<Teacher>({
  teacherCode: yup.string(),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ'),
  name: yup.string().required('Vui lòng nhập tên'),
  avatar: yup.mixed(),
  phone: yup
    .string()
    .required('Vui lòng nhập SĐT')
    .matches(phoneRegex, 'SĐT không hợp lệ')
    .max(11, 'SĐT không hợp lệ'),
  dateOfBirth: yup.date().default(() => new Date()),
  gender: yup.string<Gender>(),
  nationality: yup.string(),
  healthInsuranceNumber: yup.string(),
  passport: yup.string().required('Vui lòng nhập CMT/CCCD'),
  permanentResidence: yup.string().required('Vui lòng nhập hộ khẩu'),
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
