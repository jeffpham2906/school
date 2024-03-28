export * from './auth.types'
export interface GetResponseData<T> {
  items: T[]
  limit: number
  page: number
  total: number
  totalPages: number
}

export interface Detail<T> {
  data: { record: T }
}

export const phoneRegex =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/

export interface FileData {
  filename?: string
  ext?: string
  key?: string
  bucket?: string
  url?: string
}
