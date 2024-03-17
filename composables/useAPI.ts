import type { UseFetchOptions } from '#app'
import defu from 'defu'
import { refreshTokenAPI } from '~/utils/refreshTokenAPI'
type FetchOptions<T> = UseFetchOptions<T> & { timeout?: number }

export const useAPI = async <T = unknown>(
  url: string | (() => string),
  userOptions: FetchOptions<T> = {}
) => {
  const config = useRuntimeConfig()
  const abortController = new AbortController()
  const timeoutId = setTimeout(() => {
    abortController.abort(
      createError({
        message: 'This request has been automatically aborted.',
      })
    )
  }, userOptions.timeout)

  const defaultOptions: FetchOptions<T> = {
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
    onResponse() {},

    async onResponseError({ response }) {
      const statusCode = response.status || 500
      const statusMessage = response._data?.message
      const errorsMsg: unknown[] = response._data?.error?.issues
      // // const message = errorsMsg.map((err) => {
      // //   return ``
      // // })
      if (statusCode === 401) {
        const refreshToken = sessionStorage.getItem('refreshToken')
        const refreshTokenExpireIn = sessionStorage.getItem('rftExpireDate')
        const isRftExpired =
          new Date(refreshTokenExpireIn || 0).getTime() -
          new Date(Date.now()).getTime()
        if (!refreshToken || isRftExpired <= 0) {
          this.retry = 0
          throw createError('Failed while authenticate')
        }
        return await refreshTokenAPI(refreshToken)
      }
      console.log(response)
      createError({ statusCode, data: errorsMsg })
    },
  }

  const options = defu(userOptions, defaultOptions)
  return useFetch(url, options).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })
}
