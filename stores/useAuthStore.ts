import type { UserLogin } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<unknown>(null)
  const isAuthenticated = computed(() => !!user.value)
  const { start, finish } = useLoadingIndicator()

  const setUser = (newValue: unknown) => {
    user.value = newValue
  }

  const login = async (userData: UserLogin) => {
    start()
    const { data } = await useAPI('/auth/login', {
      method: 'POST',
      body: userData,
    })
    user.value = data.value

    await navigateTo('/')
    finish()
  }

  const signOut = async () => {
    start()
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('rftExpireDate')
    sessionStorage.removeItem('token')
    user.value = null
    await navigateTo('/auth/login')
    finish()
  }
  return {
    isAuthenticated,
    setUser,
    user,
    login,
    signOut,
  }
})
