import type { Data, GetData, GetOne } from '~/types'
import { type Teacher } from '~/types/teacher.types'

export const getAllTeachers = () => {
  const { queries } = useQuery()

  return useAPI<Data<GetData<Teacher>, Error>>('/teachers', {
    pick: ['data'],
    watch: queries ? [queries] : false,
    query: queries,
  })
}

export const createTeacher = (data: Teacher) => {
  return useAPI<GetOne<Teacher>>(`/teachers`, {
    method: 'POST',
    body: {
      record: data,
    },
    watch: false,
  })
}

export const updateTeacher = (data: object) => {
  const id = computed(() => useRoute().params.id)
  return useAPI<GetOne<Teacher>>(`/teachers/${id.value}`, {
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
  })
}
