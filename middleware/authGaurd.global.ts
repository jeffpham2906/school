const USER_SHOULD_LOGGED_IN = ['/', '/teachers', '/classes', '/students']
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return
  if (to.fullPath.includes('/auth/login?expired=true')) {
    return
  }
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn.value && USER_SHOULD_LOGGED_IN.includes(to.fullPath)) {
    return navigateTo({
      path: '/auth/login',
      query: {
        redirect_url: from.fullPath,
      },
    })
  }
})
