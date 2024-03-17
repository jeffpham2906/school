import { da } from 'date-fns/locale'
import type { UserAndTokenResponse } from '~/types'

export const refreshTokenAPI = (refreshToken: string) => {
  const authState = useAuthStore()
  const config = useRuntimeConfig()
  return $fetch('/v2/auth/refresh-token', {
    baseURL: `${config.public.baseUrl}`,
    method: 'POST',
    retry: 0,
    body: {
      refreshToken,
    },
    onResponse({ response }) {
      const data = response._data.data as UserAndTokenResponse
      const token = data.tokens.access.token
      const refreshToken = data.tokens.refresh.token
      const refreshTokenExpireIn = data.tokens.refresh.expires
      if (refreshToken && refreshTokenExpireIn && token) {
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('refreshToken', refreshToken)
        sessionStorage.setItem('rftExpireDate', refreshTokenExpireIn)
        authState.setUser(response._data.data.user || null)
      } else {
        throw createError('Refresh token failed')
      }
    },
    onResponseError({ response, error }) {
      const statusCode = response.status
      if (statusCode === 401) {
        useToast().add({ title: `${error?.message}` })
      }
      authState.setUser(null)
      sessionStorage.clear()
      console.log(error)
    },
  })
}
