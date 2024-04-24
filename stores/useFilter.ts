import queryString from 'query-string'

export interface Filter {
  label: string
  options: string[]
  autoShow?: boolean
}
export interface FilterMode {
  name: string
  value?: string
  filterObj: SelectedFilters
}
export interface SelectedFilters {
  gender: string[]
  type: string[]
  status: string[]
}

export const useFilter = defineStore('filters', () => {
  const route = useRoute()
  const allFilters: Filter[] = [
    { label: 'gender', options: ['male', 'female', 'other'], autoShow: true },
    {
      label: 'type',
      options: ['official', 'contract', 'parttime'],
      autoShow: true,
    },
    { label: 'status', options: ['active', 'disabled'] },
  ]
  const checkFirstState = (field: string): string[] => {
    if (route.query?.[field]) {
      if (typeof route.query[field] === 'string') {
        return [route.query[field]] as string[]
      } else {
        return [...(route.query[field] as string[])]
      }
    }
    return []
  }
  const parseFilterObjectToString = (obj: object) => {
    const filterObj = Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const newKey = `filter[${key}]`
        return [newKey, value]
      })
    )
    return queryString.stringify(filterObj, {
      arrayFormat: 'index',
    })
  }
  //Filter default
  const selectedFilters: SelectedFilters = reactive({
    gender: checkFirstState('gender'),
    type: checkFirstState('type'),
    status: checkFirstState('status'),
  })

  const query = ref<string>(parseFilterObjectToString(selectedFilters))

  //List saved
  const listFilterSaved = useCookie<FilterMode[]>('filters', {
    default: () => [
      {
        name: 'something',
        value: 'something',
        filterObj: { gender: ['male'], type: [], status: [] },
      },
    ],
  })

  const applyFilters = (filterMode: string) => {
    if (filterMode !== 'default') {
      const data = listFilterSaved.value.find((e) => e.name === filterMode)
      if (data) {
        query.value = parseFilterObjectToString(data.filterObj)
        navigateTo({ query: { ...data.filterObj } })
      }
      return
    }
    query.value = parseFilterObjectToString(selectedFilters)
    navigateTo({ query: { ...selectedFilters } })
    filterActived.value = 'default'
  }

  const createFilterMode = (filterMode: FilterMode) => {
    filterMode.value = filterMode.name
    listFilterSaved.value.push(filterMode)
  }
  const deleteFilterMode = (filterName: string) => {
    const index = listFilterSaved.value.findIndex((e) => e.name === filterName)
    if (index >= 0) {
      listFilterSaved.value.splice(index, 1)
    }
  }
  const filterActived = ref<string>('')
  watch(filterActived, () => console.log(filterActived.value))

  return {
    allFilters,
    selectedFilters,
    applyFilters,
    query,
    listFilterSaved,
    filterActived,
    createFilterMode,
    deleteFilterMode,
  }
})
