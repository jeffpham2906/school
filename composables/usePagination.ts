export const usePagination = () => {
  const route = useRoute()
  const page = ref(Number(route.query.page) || 1)
  watch(page, () => navigateTo({ query: { ...route.query, page: page.value } }))
  watch(
    () => route.query.page,
    () => {
      if (route.query.page) {
        page.value = +route.query.page
      }
    }
  )
  const limit = ref(Number(route.query.limit) || 10)
  watch(limit, () => {
    if (limit.value === 10) {
      const queryObj = { ...route.query }
      delete queryObj['limit']
      navigateTo({ query: queryObj })
    } else {
      navigateTo({ query: { ...route.query, limit: limit.value } })
      page.value = 1
    }
  })

  return { page, limit }
}
