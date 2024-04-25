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
