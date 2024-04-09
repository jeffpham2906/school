import type { UseFetchOptions } from '#app'
import defu from 'defu'
import USpin from '~/components/USpin.vue'

export const useAPI = async <T = unknown>(
  url: string | (() => string),
  userOptions: UseFetchOptions<T> = {}
) => {
  const { token, refresh } = useAuth()
  const config = useRuntimeConfig()
  const modal = useModal()
  const abortController = new AbortController()
  let isRefreshed = false
  refreshCookie('refreshToken')
  refreshCookie('token')
  const defaultOptions: UseFetchOptions<T> = {
    baseURL: `${config.public.baseUrl}`,
    method: 'GET',
    signal: abortController.signal,
    retry: 0,
    key: typeof url === 'string' ? url : url(),
    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
          Accept: 'application/json',
          'Content-type': 'application/json',
        }
      }
    },
    async onResponse({ response, request }) {
      const hasError =
        !response.ok || response.status.toString().startsWith('4')
      if (hasError) {
        if (response.status === 401 && !isRefreshed) {
          const newRes = await refresh()
            .then(() => retryRequest(request, options))
            .catch(() => {
              navigateTo({ path: '/auth/login', query: { expired: 'true' } })
            })
          isRefreshed = true
          return newRes
        }
      }
    },

    async onResponseError({ response, request }) {
      if (response.status === 401 && !isRefreshed) {
        const newRes = await refresh()
          .then(() => retryRequest(request, options))
          .catch(() => {
            navigateTo({ path: '/auth/login', query: { expired: 'true' } })
          })
        isRefreshed = true
        return newRes
      }
      // throw createError({
      //   statusCode: response.status,
      //   statusMessage: response._data.message,
      //   message: response._data.error,
      // })
    },
  }

  const options = defu(userOptions, defaultOptions)
  modal.open(USpin)

  return useFetch(url, options).finally(() => {
    isRefreshed = false
    return modal.close()
  })
}
