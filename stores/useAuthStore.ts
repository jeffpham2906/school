import type { UserLogin } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<unknown>(null)
  const isAuthenticated = computed(() => !!user.value)
  const { start, finish } = useLoadingIndicator()

  const setUser = (newValue: unknown) => {
    user.value = newValue
  }

  const login = async (userData: UserLogin) => {
    try {
      start()
      const { data } = await useAPI('/auth/login', {
        method: 'POST',
        body: userData,
      })
      user.value = data.value

      await navigateTo('/')
    } catch (error) {
      console.log('fetch error', error)
    } finally {
      finish()
    }
  }

  const signOut = async () => {
    try {
      start()
      sessionStorage.removeItem('refreshToken')
      sessionStorage.removeItem('rftExpireDate')
      sessionStorage.removeItem('token')
      user.value = null
      await navigateTo('/auth/login')
    } catch (error) {
      console.log(error)
    } finally {
      finish()
    }
  }
  return {
    isAuthenticated,
    setUser,
    user,
    login,
    signOut,
  }
})
