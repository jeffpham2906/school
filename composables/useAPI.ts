import type { UseFetchOptions } from '#app'
import defu from 'defu'
import { useAuthStore } from '~/stores/useAuthStore'

export const useAPI = <T = unknown>(
  url: string | (() => string),
  userOptions: UseFetchOptions<T> = {}
) => {
  const config = useRuntimeConfig()

  const authState = useAuthStore()

  const defaultOptions: UseFetchOptions<T> = {
    baseURL: `${config.public.baseUrl}`,
    method: 'GET',
    retry: 1,
    retryDelay: 500,
    retryStatusCodes: [401],
    key: typeof url === 'string' ? url : url(),
    server: false,
    onRequest({ options }) {
      const token = sessionStorage.getItem('token')

      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-type': 'application/json',
        }
      }
    },
    onResponse({ response }) {
      const token = response._data.data?.tokens?.access.token
      const refreshToken = response._data.data?.tokens?.refresh.token
      const refreshTokenExpireIn = response._data.data?.tokens?.refresh.expires

      if (refreshToken && refreshTokenExpireIn) {
        sessionStorage.setItem('refreshToken', refreshToken)
        sessionStorage.setItem('rftExpireDate', refreshTokenExpireIn)
      }
      if (token) {
        sessionStorage.setItem('token', token)
      }
      return response._data
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        const refreshToken = sessionStorage.getItem('refreshToken')
        const refreshTokenExpireIn = sessionStorage.getItem('rftExpireDate')
        const isRftExpired =
          new Date(refreshTokenExpireIn || 0).getTime() -
          new Date(Date.now()).getTime()
        if (!refreshToken || isRftExpired <= 0) {
          this.retry = 0

          return createError('Failed while authenticate')
        }
        return await useFetch('/auth/refresh-token', {
          baseURL: `${config.public.baseUrl}`,
          method: 'POST',
          server: false,
          retry: 0,
          body: {
            refreshToken: refreshToken,
          },
          onResponse({ response }) {
            const token = response._data.data?.tokens?.access.token
            const refreshToken = response._data.data?.tokens?.refresh.token
            const refreshTokenExpireIn =
              response._data.data?.tokens?.refresh.expires
            if (refreshToken && refreshTokenExpireIn) {
              sessionStorage.setItem('refreshToken', refreshToken)
              sessionStorage.setItem('rftExpireDate', refreshTokenExpireIn)
            }
            if (token) {
              sessionStorage.setItem('token', token)
            }
            return response._data
          },
          onResponseError({ error }) {
            authState.setUser(null)
            sessionStorage.clear()
            console.log(error)
          },
        })
      }
    },
  }

  const options = defu(userOptions, defaultOptions)
  return useFetch(url, options)
}
