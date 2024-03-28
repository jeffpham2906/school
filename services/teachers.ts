import type { Teacher } from '~/types/teacher.types'

export interface GetAllTeachersProps {
  limit: number
  page: number
  'filter[gender]'?: string | null
  'filter[type]'?: string | null
  'filter[status]'?: string | null
  search?: string
}

export const getAllTeachers = (queries?: Ref<GetAllTeachersProps>) => {
  return useAPI('/teachers', {
    query: queries,
    watch: queries ? [queries] : false,
    timeout: 7000,
    immediate: false,
  })
}

export const getTeacher = (id: string | undefined) => {
  return useAPI(`/teachers/${id}`, {
    immediate: false,
  })
}

export const createTeacher = (data: Teacher) => {
  return useAPI(`/teachers`, {
    method: 'POST',
    body: {
      record: data,
    },
    watch: false,
  })
}

export const updateTeacher = (data: object, id: string) => {
  return useAPI(`/teachers/${id}`, {
    method: 'PATCH',
    body: {
      record: data,
    },
    watch: false,
  })
}

export const deleteTeacher = async (id: string) => {
  return useAPI(`/teachers/${id}`, {
    method: 'DELETE',
    async onResponse({ response }) {
      if (!response.ok) {
        return useToast().add({
          title: response._data.message,
          icon: 'i-heroicons-x-circle',
          color: 'red',
          timeout: 2500,
        })
      }
      useToast().add({
        title: 'Xoá thành công',
        timeout: 2500,
        icon: 'i-heroicons-check-circle',
      })
    },
    onRequestError({ response }) {
      console.log('errr', response)
    },
  })
}
