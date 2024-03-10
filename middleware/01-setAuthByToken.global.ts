import { useAuthStore } from '~/stores/useAuthStore'

export default defineNuxtRouteMiddleware(async () => {
  const authState = useAuthStore()
  if (authState.isAuthenticated) {
    return
  }
  const { data } = await useAPI('/auth/user-info')
  authState.setUser(data.value || null)
})
