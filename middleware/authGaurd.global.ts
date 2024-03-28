export default defineNuxtRouteMiddleware(async () => {
  const { getUser } = useAuth()

  await getUser()
})
