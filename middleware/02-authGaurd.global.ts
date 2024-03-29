import { useAuthStore } from '~/stores/useAuthStore'

const USERS_MUST_BE_LOGIN_IN_ROUTES = ['/students', '/teachers']
export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const authState = useAuthStore()
  if (authState.isAuthenticated) {
    return
  }

  const isNeedLogin = USERS_MUST_BE_LOGIN_IN_ROUTES.some((item) => {
    return to.fullPath === '/' ? true : to.fullPath.includes(item)
  })

  if (!authState.isAuthenticated && isNeedLogin) {
    return '/auth/login'
  }
})
