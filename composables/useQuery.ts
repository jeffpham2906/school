export const useQuery = () => {
  const route = useRoute()
  const router = useRouter()

  const setRoute = (field: object, clearLabel?: string) => {
    const newRoute = { ...route.query, ...field }
    if (clearLabel === '' || clearLabel) {
      const key = Object.getOwnPropertyNames(field)[0]
      if (String(newRoute[key]) === clearLabel) {
        delete newRoute[key]
      }
    }
    router.push({ path: route.fullPath, query: newRoute })
  }

  const queries = ref()
  watch(
    () => route.query,
    () => {
      queries.value = { ...route.query }
    }
  )
  onMounted(() => (queries.value = route.query))
  return {
    queries,
    setRoute,
  }
}
