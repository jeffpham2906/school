interface Image {
  key: string
  bucket: string
  url: string
}
export type Gender = 'male' | 'female' | 'other'
export type Type = 'official' | 'contract' | 'parttime'
export type Status = 'active' | 'inactive'
export interface Teacher {
  name: string

  teacherCode?: string
  avatar?: File | undefined
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
