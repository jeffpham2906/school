import type { Teacher } from '~/types/teacher.types'

export interface GetAllTeachersProps {
  limit: number
  page: number
  'filter[gender]'?: string | null
  'filter[type]'?: string | null
  'filter[status]'?: string | null
}

export const getAllTeachers = (queries?: Ref<GetAllTeachersProps>) => {
  return useAPI(() => '/teachers', {
    query: queries,
    watch: queries ? [queries] : false,
    timeout: 7000,
  })
}

export const createTeacher = (data: Teacher) => {
  return useAPI('/teachers', {
    method: 'POST',
    body: {
      record: data,
    },
    watch: false,
  })
}

export const deleteTeacher = (id: string) => {
  return useAPI(`/teachers/${id}`, {
    method: 'DELETE',
  })
}
