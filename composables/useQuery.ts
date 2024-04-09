export const useQuery = () => {
  const route = useRoute()

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
  }
}
