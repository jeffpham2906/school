import type { LocationQueryValue } from 'vue-router'

export interface Error {
  status: number
}
export interface Data<T, U> {
  status: number
  message: string
  data: T
  error: U
}
export interface GetData<T> {
  items: T[]
  limit: number
  page: number
  sort: Sort
  total: number
  hasNextPage: boolean
  hasPrevPage: boolean
  totalPages: number
  search: string | LocationQueryValue[]
  filter: object
  filterCustom: object
}
export interface GetOne<T> {
  record: T
}

export interface Error {
  issues: Issue[]
}

export interface Issue {
  code: string
  message: string
  path: string[]
}

export interface Sort {
  column: string
  direction: string
}
export interface Query {
  page: number
  limit: number
  filter: object
  search?: string | LocationQueryValue[]
  sort: Sort
}
export interface FunctionVoid {
  async(...args: unknown[]): void | Promise<void>
}
