import USpin from '~/components/USpin.vue'
import type { Teacher } from '~/types/teacher.types'

export const useUpload = () => {
  const modal = useModal()
  const upLoad = async (e: Event, field: string, state: Ref<Teacher>) => {
    modal.open(USpin)
    // @ts-expect-error file
    const file = e.target.files[0]

    if (field === 'avatar') {
      state.value.avatar = await doUpload(file).finally(() => modal.close())
    } else if (field === 'contracts') {
      const newContract = await doUpload(file).finally(() => modal.close())
      if (newContract) {
        if (state.value.contracts) {
          state.value.contracts = [...state.value.contracts, newContract]
        } else {
          state.value.contracts = [newContract]
        }
      }
    }
  }
  return { upLoad }
}
