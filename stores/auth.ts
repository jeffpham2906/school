import type { LocationQueryValue } from 'vue-router'
import type { UserData, UserLogin } from '~/types'
export const useAuth = () => {
  const config = useRuntimeConfig()
  const userData = useState<UserData | null>('userData', () => null)
  const isLoggedIn = computed(() => !!(token.value || refreshToken.value))
  const token = useCookie('token', { sameSite: 'lax' })
  const refreshToken = useCookie('refreshToken', { sameSite: 'lax' })

  const signIn = async (
    data: UserLogin,
    redirect: LocationQueryValue | LocationQueryValue[] = '/teachers'
  ) => {
    return useAPI('/v2/auth/login', {
      method: 'POST',
      body: data,
      watch: false,
      retry: 0,
      onResponse({ response }) {
        if (response.ok) {
          token.value = response._data.data.tokens.access.token
          refreshToken.value = response._data.data.tokens.refresh.token
          userData.value = response._data.data.user
          navigateTo(String(redirect))
        }
      },
      onResponseError({ response }) {
        throw createError({ statusCode: 401, message: response._data.message })
      },
    })
  }

  const getUser = () => {
    return useAPI('/v2/auth/user-info', {
      onResponse({ response }) {
        if (response.ok) {
          userData.value = response._data.data.record
        }
      },
    })
  }

  const refresh = async () => {
    return $fetch(`${config.public.baseUrl}/v2/auth/refresh-token`, {
      method: 'POST',
      body: { refreshToken: refreshToken.value },
      retry: 0,
      async onResponse({ response }) {
        if (response.ok) {
          token.value = response._data.data.tokens.access.token
          refreshToken.value = response._data.data.tokens.refresh.token
          userData.value = response._data.data.user
        }
      },
      onResponseError({ response }) {
        token.value = null
        refreshToken.value = null
        const queryObj = {
          redirect_url: useRoute().fullPath,
        }
        if (response.status === 401) {
          queryObj.expired = 'true'
          queryObj.message = response._data.message
        }
        navigateTo({
          path: '/auth/login',
          query: queryObj,
        })
      },
    })
  }

  const signOut = () => {
    return useAPI('/v2/auth/logout', {
      method: 'POST',
      body: { accessToken: token.value, refreshToken: token.value },
      async onResponse({ response }) {
        if (response.ok) {
          userData.value = null
          token.value = null
          refreshToken.value = null
          navigateTo('/auth/login')
        }
      },
    })
  }
  return {
    userData,
    isLoggedIn,
    token,
    signIn,
    refreshToken,
    getUser,
    refresh,
    signOut,
  }
}
