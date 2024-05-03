import queryString from 'query-string'

export interface Filter {
  label: string
  options: string[]
  autoShow?: boolean
}
export interface FilterMode {
  value: string
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
    default: () => [],
  })

  const setLabelFilterArr = (filterObj: SelectedFilters): string[] => {
    return Object.keys(filterObj).reduce((pre: string[], curr) => {
      if (selectedFilters[curr as keyof SelectedFilters].length >= 1) {
        pre.push(curr)
      }
      return pre
    }, [])
  }

  const labelFilterArr = ref<string[]>(setLabelFilterArr(selectedFilters))

  const applyFilters = (filterMode: string) => {
    if (filterMode !== 'default') {
      const data = listFilterSaved.value.find((e) => e.value === filterMode)
      if (data) {
        selectedFilters.gender = []
        selectedFilters.type = []
        selectedFilters.status = []
        query.value = parseFilterObjectToString(data.filterObj)
        labelFilterArr.value = [filterMode]
        navigateTo({ query: { ...data.filterObj } })
        return
      }
    }
    filterActived.value = 'default'
    query.value = parseFilterObjectToString(selectedFilters)
    labelFilterArr.value = setLabelFilterArr(selectedFilters)
    navigateTo({ query: { ...selectedFilters } })
  }

  const createFilterMode = (filterMode: FilterMode) => {
    filterActived.value = filterMode.value
    listFilterSaved.value = [...listFilterSaved.value, filterMode]
    applyFilters(filterMode.value)
  }
  const deleteFilterMode = (filterName: string) => {
    const index = listFilterSaved.value.findIndex((e) => e.value === filterName)
    if (index >= 0) {
      listFilterSaved.value.splice(index, 1)
    }
  }
  const updateFilterMode = (filter: FilterMode, staleValue: string) => {
    listFilterSaved.value = listFilterSaved.value.map((e) => {
      if (e.value === staleValue) {
        return filter
      }
      return e
    })
  }
  const onClearFilter = () => {
    selectedFilters.gender = []
    selectedFilters.type = []
    selectedFilters.status = []
  }
  const filterActived = ref<string>('default')
  return {
    allFilters,
    selectedFilters,
    applyFilters,
    query,
    listFilterSaved,
    filterActived,
    createFilterMode,
    deleteFilterMode,
    updateFilterMode,
    onClearFilter,
    labelFilterArr,
  }
})
