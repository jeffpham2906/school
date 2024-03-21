import type { UseFetchOptions } from '#app'
import defu from 'defu'
import { refreshTokenAPI } from '~/utils/refreshTokenAPI'
type FetchOptions<T> = UseFetchOptions<T> & { timeout?: number }

export const useAPI = async <T = unknown>(
  url: string | (() => string),
  userOptions: FetchOptions<T> = {}
) => {
  const { getToken, getRefreshToken } = useTokens()
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
      const token = getToken()

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
      const hasError =
        !response.status.toString().startsWith('2') || response._data.error
      if (hasError) {
        throw createError({
          statusCode: response.status,
          message:
            response._data?.message || JSON.stringify(response._data.error),
        })
      }
    },

    async onResponseError({ response }) {
      const statusCode = response.status || 500
      const errorsMsg: unknown[] = response._data?.error?.issues

      if (statusCode === 401) {
        const { isExpired, token } = getRefreshToken()
        if (!token || isExpired) {
          this.retry = 0
          return createError('Token is expired')
        }
        return await refreshTokenAPI()
      }
      throw createError({ statusCode, data: errorsMsg })
    },
  }

  const options = defu(userOptions, defaultOptions)
  return useFetch(url, options).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })
}
