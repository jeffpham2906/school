export const useAuthStore = defineStore('auth', () => {
  const user = ref<unknown>(null)
  const isAuthenticated = computed(() => !!user.value)
  // const isAuthenticated = true
  const { start, finish } = useLoadingIndicator()
  const setUser = (newValue: unknown) => {
    user.value = newValue
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
    signOut,
  }
})
