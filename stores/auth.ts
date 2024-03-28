import type { UserData, UserLogin } from '~/types'
type Status = 'unauthorization' | 'authorization' | 'loading'
export const useAuth = () => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const { start, finish } = useLoadingIndicator()
  const userData = useState<UserData | null>('userData', () => null)
  const status = useState<Status>('status', () => 'unauthorization')
  const token = useCookie('token', { sameSite: 'lax' })
  const refreshToken = useCookie('refreshToken', { sameSite: 'lax' })

  const signIn = async (data: UserLogin, redirect = '/') => {
    start()
    status.value = 'loading'
    return $fetch(`${config.public.baseUrl}/v2/auth/login`, {
      method: 'POST',
      body: data,
      onResponse({ response }) {
        if (response.ok) {
          token.value = response._data.data.tokens.access.token
          refreshToken.value = response._data.data.tokens.refresh.token
          userData.value = response._data.data.user
          status.value = 'authorization'
          router.replace(redirect)
          return
        }
        status.value = 'unauthorization'
      },
    }).finally(() => finish())
  }

  const getUser = () => {
    if (!token.value && !refreshToken.value) {
      return navigateTo('/auth/login')
    }
    status.value = 'loading'
    return useAPI('/v2/auth/user-info', {
      onResponse({ response }) {
        if (response.ok) {
          userData.value = response._data.data.record
          status.value = 'authorization'
          return
        }
        status.value = 'unauthorization'
      },
      onRequestError() {
        console.log('error get user')
        status.value = 'unauthorization'
      },
    })
  }

  const refresh = async () => {
    start()
    status.value = 'loading'

    return useAPI(`/v2/auth/refresh-token`, {
      method: 'POST',
      body: { refreshToken: refreshToken.value },
      retry: 0,
      onResponse({ response }) {
        if (!response.ok) {
          status.value = 'unauthorization'
          return navigateTo({
            path: '/auth/login',
            query: { expired: 'true' },
          })
        }
        token.value = response._data.data.tokens.access.token
        refreshToken.value = response._data.data.tokens.refresh.token
        userData.value = response._data.data.user
        status.value = 'authorization'
      },
      onResponseError({ response }) {
        if (response.status === 401) {
          return navigateTo({
            path: '/auth/login',
            query: { expired: 'true' },
          })
        }
      },
    }).finally(() => finish())
  }

  const signOut = async () => {
    start()
    status.value = 'loading'
    return await useAPI('/v2/auth/logout', {
      method: 'POST',
      onResponse({ response }) {
        if (response.ok) {
          userData.value = null
          token.value = null
          refreshToken.value = null
          status.value = 'unauthorization'
          router.replace('/auth/login')
        }
      },
    }).finally(() => finish())
  }
  return {
    userData,
    status,
    token,
    signIn,
    refreshToken,
    getUser,
    refresh,
    signOut,
  }
}
