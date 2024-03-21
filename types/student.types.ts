export interface Student {
  avatar: {
    key: string
    bucket: string
    url: string
  }
  name: string
  studentCode: string
  pastClassIds: string[]
  nationality: string
  slug: string
  gender: string
  healthInsuranceNumber: string
  identityNumber: string
  permanentResidence: string
  currentAddress: string
  note: string
  status: string
  type: string
  currentClassId: string
  dateOfBirth: string
  parents: [
    {
      parentId: string
      type: string
      _id: string
    },
  ]
  createdAt: string
  updatedAt: string
  id: string
}
