export * from './auth.types'
export interface GetResponseData<T> {
  items: T[]
  limit: number
  page: number
  total: number
  totalPages: number
}
