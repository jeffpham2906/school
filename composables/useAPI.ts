import type { UseFetchOptions } from '#app'
import defu from 'defu'
type FetchOptions<T> = UseFetchOptions<T> & { timeout?: number }

export const useAPI = async <T = unknown>(
  url: string | (() => string),
  userOptions: FetchOptions<T> = {}
) => {
  const { start, finish } = useLoadingIndicator()
  const { token, refresh } = useAuth()
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
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
          Accept: 'application/json',
          'Content-type': 'application/json',
        }
      }
    },
    async onResponse({ response }) {
      const hasError =
        !response.ok || response.status.toString().startsWith('4')
      if (hasError) {
        // if (response.status === 401) {
        //   return await refresh()
        // } else {
        //   throw createError({
        //     statusCode: response.status,
        //     message:
        //       response._data?.message || JSON.stringify(response._data.error),
        //   })
        // }
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        const { error } = await refresh()
        if (error.value) {
          this.retry = 0
        }
      }
      // const statusCode = response.status || 500
      // const statusMessage = response || ''
      // const errorsMsg = (response._data || {}) as ErrorTypes

      // const errorEntries = Object.entries(errorsMsg.errors)

      // const message = errorEntries.reduce((acc: string[], [key, value]) => {
      //   return [...acc, ...value.map((item) => `${key} ${item}`)]
      // }, [])

      // throw createError({
      //   statusCode,
      //   statusMessage,
      //   message: message.join(ERROR_SEPARATOR),
      // })
    },
  }

  const options = defu(userOptions, defaultOptions)
  start()
  return useFetch(url, options)
    .finally(() => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    })
    .finally(() => finish())
}
