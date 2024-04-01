const ROUTE_USER_NEED_LOGGED_IN = ['/', '/teachers', '/students']
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return
  if (to.fullPath.includes('/auth/login?expired=true')) {
    return
  }

  const { getUser, isLoggedIn } = useAuth()
  if (isLoggedIn.value) return
  await getUser()
  await nextTick()
  if (!isLoggedIn.value && ROUTE_USER_NEED_LOGGED_IN.includes(to.fullPath)) {
    return await navigateTo({
      path: '/auth/login',
      query: { redirect_url: from.fullPath },
    })
  }
})
