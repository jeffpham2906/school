export interface Student {
  studentCode: string
  name: string
  gender: string
  dateOfBirth: string
  class: string
}

export interface AllStudents {
  items: Student[]
  total: number
  totalPages: number
  page: number
  limit: number
}

export interface ResponeStudents {
  data: AllStudents
}
