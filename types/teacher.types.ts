export interface Teacher {
  name: string
  slug?: string
  teacherCode?: string
  email: string
  phone: string
  gender?: Gender
  nationality?: string
  passport: string
  healthInsuranceNumber: string
  permanentResidence: string
  currentAddress: string
  currentClassId?: string
  pastClassIds?: string[]
  status: Status
  type: Type
  note: string
  createdById?: string
  createdBy?: AtedBy
  contracts?: Avatar[]
  createdAt?: Date
  updatedAt?: Date
  syncStatus?: string
  dateOfBirth?: Date
  updatedBy?: AtedBy
  updatedById?: string
  id?: string
  avatar?: Avatar
}

export interface Avatar {
  key: string
  bucket: string
  url: string
  ext: string
  filename: string
  _id?: string
}

export interface AtedBy {
  username: string
  role: string
  parentId: string
  status: Status
  createdAt: Date
  updatedAt: Date
  syncStatus: string
  id: string
}

export enum Status {
  Active = 'active',
  Disabled = 'disabled',
}

export enum Gender {
  Female = 'female',
  Male = 'male',
  Other = 'other',
}

export enum Type {
  Contract = 'contract',
  Official = 'official',
  Parttime = 'parttime',
}

export enum Action {
  Create = 'create',
  Detail = 'detail',
  Change = 'change',
  Delete = 'delete',
}
