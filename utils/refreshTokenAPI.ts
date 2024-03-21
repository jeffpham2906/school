import type { UserAndTokenResponse } from '~/types'

export const refreshTokenAPI = () => {
  const authState = useAuthStore()
  const config = useRuntimeConfig()
  const { getRefreshToken, setTokenAuth, clearTokenAuth } = useTokens()
  const { token } = getRefreshToken()
  return $fetch('/v2/auth/refresh-token', {
    baseURL: `${config.public.baseUrl}`,
    method: 'POST',
    retry: 0,
    body: {
      refreshToken: token,
    },
    onResponse({ response }) {
      const data = response._data.data as UserAndTokenResponse
      const { token } = data.tokens.access
      const refreshToken = data.tokens.refresh.token
      const refreshTokenExpireIn = data.tokens.refresh.expires
      if (refreshToken && refreshTokenExpireIn && token) {
        setTokenAuth(token, refreshToken, refreshTokenExpireIn)
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
      clearTokenAuth()
      console.log(error)
    },
  })
}
