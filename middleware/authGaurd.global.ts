export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return
  if (to.fullPath.includes('/auth/login?expired=true')) {
    return
  }

  const { getUser, isLoggedIn } = useAuth()
  if (isLoggedIn.value) return
  await getUser()
})
