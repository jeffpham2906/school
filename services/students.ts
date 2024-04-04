export interface GetAllStudentsProps {
  limit?: number
  page?: number
  'filter[gender]'?: string | null
  // 'filter[type]'?: string | null
  // 'filter[status]'?: string | null
}
export const getAllStudents = (queries?: Ref<GetAllStudentsProps>) => {
  return useAPI(() => '/students', {
    query: queries,
    watch: queries ? [queries] : false,
    timeout: 7000,
  })
}
