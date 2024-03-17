import type { AllStudents } from '~/types/student.types'

interface GetAllStudentsProps {
  limit: number
}
export const getAllStudents = (queries: ComputedRef<GetAllStudentsProps>) => {
  return useAPI('/students', {
    query: queries,
    watch: [queries],
  })
}
