import type { UseFetchOptions } from '#app'
import defu from 'defu'
import USpin from '~/components/USpin.vue'
type FetchOptions<T> = UseFetchOptions<T> & { timeout?: number }

export const useAPI = async <T = unknown>(
  url: string | (() => string),
  userOptions: FetchOptions<T> = {}
) => {
  const { token, refresh } = useAuth()
  const toast = useToast()
  const config = useRuntimeConfig()
  const modal = useModal()
  const abortController = new AbortController()
  const timeoutId = setTimeout(() => {
    abortController.abort(
      createError({
        message: 'This request has been automatically aborted.',
      })
    )
  }, userOptions.timeout || 10000)

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
        console.log('Has error')
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        const { error } = await refresh()
        if (error.value) {
          this.retry = 0
        }
      }
      if (response.status.toString().startsWith('5')) {
        toast.add({ title: response._data.message })
      }
    },
  }

  const options = defu(userOptions, defaultOptions)
  modal.open(USpin)
  return useFetch(url, options)
    .finally(() => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    })
    .finally(() => modal.close())
}
