import type { LocationQueryValue } from 'vue-router'
import type { UserData, UserLogin } from '~/types'
export const useAuth = () => {
  const router = useRouter()
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
      immediate: false,
      retry: 0,
      async onResponse({ response }) {
        if (response.ok) {
          token.value = response._data.data.tokens.access.token
          refreshToken.value = response._data.data.tokens.refresh.token
          userData.value = response._data.data.user
          await navigateTo(String(redirect))
        }
      },
      onResponseError({ response }) {
        throw createError({
          statusCode: response._data.status,
          message: response._data.message,
        })
      },
    })
  }

  const getUser = async () => {
    return useAPI('/v2/auth/user-info', {
      watch: false,
      onResponse({ response }) {
        if (response.ok) {
          userData.value = response._data.data.record
          return
        }
      },
      onRequestError() {
        console.log('error get user')
      },
    })
  }

  const refresh = async () => {
    userData.value = null
    if (!refreshToken.value) {
      await navigateTo({
        path: '/auth/login',
        query: { redirect_url: useRoute().fullPath },
      })
      throw createError({ statusCode: 401, message: 'Không có token' })
    }
    return useAPI(`/v2/auth/refresh-token`, {
      method: 'POST',
      body: { refreshToken: refreshToken.value },
      retry: 0,
      async onResponse({ response }) {
        if (!response.ok) {
          await navigateTo({
            path: '/auth/login',
            query: { expired: 'true', redirect_url: useRoute().fullPath },
          })
        }
        token.value = response._data.data.tokens.access.token
        refreshToken.value = response._data.data.tokens.refresh.token
        userData.value = response._data.data.user
      },
      async onResponseError() {
        return await navigateTo({
          path: '/auth/login',
          query: { expired: 'true', redirect_url: useRoute().fullPath },
        })
      },
    })
  }

  const signOut = async () => {
    return await useAPI('/v2/auth/logout', {
      method: 'POST',
      onResponse({ response }) {
        if (response.ok) {
          userData.value = null
          token.value = null
          refreshToken.value = null
          router.replace('/auth/login')
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
