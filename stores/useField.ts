export interface ViewMode {
  label: string
  fields: Column[]
  isEdited?: boolean
  value: string
}
export interface Column {
  key: string
  label: string
  sortable?: boolean
}
const basicField = [
  {
    key: 'teacherCode',
    label: 'teacherCode',
  },
  {
    key: 'name',
    label: 'name',
    sortable: true,
  },
  {
    key: 'gender',
    label: 'gender',
  },
  {
    key: 'phone',
    label: 'phone',
  },
  {
    key: 'email',
    label: 'email',
  },
  {
    key: 'type',
    label: 'type',
  },
  {
    key: 'status',
    label: 'status',
  },
  {
    key: 'actions',
    label: 'actions',
  },
]
const advanceField = [
  {
    key: 'gender',
    label: 'gender',
  },
  {
    key: 'phone',
    label: 'phone',
  },
  {
    key: 'email',
    label: 'email',
  },
  {
    key: 'type',
    label: 'type',
  },
  {
    key: 'status',
    label: 'status',
  },
  {
    key: 'actions',
    label: 'actions',
  },
]
const customField = [
  {
    key: 'teacherCode',
    label: 'teacherCode',
  },
  {
    key: 'name',
    label: 'name',
    sortable: true,
  },
]
export const useField = defineStore('field', () => {
  const allFields = [
    {
      key: 'teacherCode',
      label: 'teacherCode',
    },
    {
      key: 'name',
      label: 'name',
      sortable: true,
    },
    {
      key: 'gender',
      label: 'gender',
    },
    {
      key: 'phone',
      label: 'phone',
    },
    {
      key: 'email',
      label: 'email',
    },
    {
      key: 'type',
      label: 'type',
    },
    {
      key: 'status',
      label: 'status',
    },
    {
      key: 'nationality',
      label: 'nationality',
      sortable: true,
    },
    {
      key: 'passport',
      label: 'passport',
      sortable: true,
    },
    {
      key: 'permanentResidence',
      label: 'permanentResidence',
    },
    {
      key: 'currentAddress',
      label: 'currentAddress',
    },
    {
      key: 'createdBy',
      label: 'createdBy',
    },
    {
      key: 'createdAt',
      label: 'createdAt',
    },
    {
      key: 'updatedAt',
      label: 'updatedAt',
    },
    {
      key: 'actions',
      label: 'actions',
    },
  ]

  const temp: ViewMode[] = [
    { label: 'basic', value: 'basic', fields: basicField, isEdited: false },
    {
      label: 'advanced',
      value: 'advanced',
      fields: advanceField,
      isEdited: false,
    },
    { label: 'custom', value: 'custom', fields: customField, isEdited: false },
  ]

  const storeFieldCookie = useCookie<ViewMode[]>('field')
  const viewModeOptions = computed(() => storeFieldCookie.value)
  watch(
    storeFieldCookie,
    () => {
      if (!storeFieldCookie.value) {
        storeFieldCookie.value = temp
      }
    },
    {
      immediate: true,
    }
  )
  const viewModeSelected = ref<string>('basic')
  const selectedFields = ref<Column[]>(basicField)

  watch(viewModeSelected, () => {
    const data: ViewMode | undefined = storeFieldCookie.value.find(
      (e) => e.label === viewModeSelected.value
    )
    if (data) {
      if (data.value === 'custom') {
        return
      }
      selectedFields.value = data.fields
    }
  })

  const createViewMode = (data: ViewMode) => {
    console.log('create view mode')
    data.isEdited = true
    data.value = data.label
    storeFieldCookie.value.push(data)
    viewModeSelected.value = data.label
  }

  const updateViewMode = (staleLabel: string, data: ViewMode) => {
    data.value = data.label
    data.isEdited = true
    const index = storeFieldCookie.value.findIndex(
      (e) => e.label === staleLabel
    )
    if (index >= 0) {
      storeFieldCookie.value.splice(index, 1, data)
      viewModeSelected.value = data.value
    }
  }

  const deleteViewMode = (value: string) => {
    const index = storeFieldCookie.value.findIndex((e) => e.value === value)
    if (index >= 0) {
      storeFieldCookie.value.splice(index, 1)
      viewModeSelected.value = 'basic'
    }
  }

  return {
    allFields,
    selectedFields,
    viewModeOptions,
    viewModeSelected,
    createViewMode,
    deleteViewMode,
    updateViewMode,
  }
})
