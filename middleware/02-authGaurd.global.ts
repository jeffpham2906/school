import { useAuthStore } from '~/stores/useAuthStore'

const USERS_MUST_BE_LOGIN_IN_ROUTES = ['/', '/user']
export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return
  const authState = useAuthStore()
  if (authState.isAuthenticated) {
    return
  }
  const isNeedLogin = USERS_MUST_BE_LOGIN_IN_ROUTES.some((item) => {
    return to.fullPath === item
  })

  if (!authState.isAuthenticated && isNeedLogin) {
    return await navigateTo('/auth/login', { redirectCode: 401 })
  }
})
