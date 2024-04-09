import type { LocationQueryValue } from 'vue-router'
import type { UserData, UserLogin } from '~/types'
export const useAuth = () => {
  const userData = useState<UserData | null>('userData', () => null)
  const isLoggedIn = computed(() => !!userData.value)
  const token = useCookie('token', { sameSite: 'lax' })
  const refreshToken = useCookie('refreshToken', { sameSite: 'lax' })

  const signIn = async (
    data: UserLogin,
    redirect: LocationQueryValue | LocationQueryValue[] = '/'
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

  const getUser = async () => {
    const { error } = await useAPI('/v2/auth/user-info', {
      onResponse({ response }) {
        if (response.ok) {
          userData.value = response._data.data.record
        }
      },
    })
    if (error.value?.data) {
      return useRouter().replace({
        path: '/auth/login',
        query: { expired: 'true' },
      })
    }
  }

  const refresh = async () => {
    const config = useRuntimeConfig()

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
    })
  }

  const signOut = (redirect_url: string = '') => {
    return useAPI('/v2/auth/logout', {
      method: 'POST',
      async onResponse({ response }) {
        if (response.ok) {
          userData.value = null
          token.value = null
          refreshToken.value = null
          navigateTo({
            path: '/auth/login',
            query: {
              redirect_url,
            },
          })
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
