interface Image {
  key: string
  bucket: string
  url: string
}
export type Gender = 'male' | 'female' | 'other'
export type Type = 'official' | 'contract' | 'partime'
export type Status = 'active' | 'inactive'
export interface Teacher {
  name: string
  teacherCode: string
  avatar?: Image
  contract?: Image
  email: string
  phone: string
  dateOfBirth: Date | string
  gender: Gender
  nationality: string
  healthInsuranceNumber: string
  identityNumber: string
  permanentResidence: string
  currentAddress: string
  note?: string
  status: Status
  type?: Type
}

export interface TeacherData {
  items: Teacher[]
  limit: number
  page: number
  total: number
  totalPages: number
}
